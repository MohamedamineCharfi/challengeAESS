import os
import pandas as pd
from dotenv import load_dotenv
from typing import Type

# Core CrewAI components
from crewai import Agent, Task, Crew, Process 
from crewai import LLM # Use CrewAI's LLM wrapper

# LLM import from LangChain for environment context
from langchain_google_genai import ChatGoogleGenerativeAI 

# Import BaseTool and Pydantic for proper tool compatibility
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

# --- Configuration Check ---
print(f"✅ GEMINI_API_KEY loaded: {'Yes' if os.getenv('GEMINI_API_KEY') else 'No'}")

# --- LLM Initialization ---
gemini_llm = LLM(
    model="gemini-2.0-flash",
    api_key=os.getenv('GEMINI_API_KEY'),
    provider="google"
)

# ---------------------------
# TOOL: Data Loading (Expanded to include battery/panel parameters and 3-Sigma)
# ---------------------------
def data_loading_tool(folder_path: str) -> str:
    """Reads CubeSat telemetry Excel files and computes detailed descriptive statistics.

    Note: CrewAI's Agent validation was strict about accepting local BaseTool subclasses.
    To avoid cross-library BaseTool type mismatches, we expose this tool as a plain
    callable and a simple dict that CrewAI will accept as a tool descriptor.
    """
    summary_report = "## 🛰️ CubeSat Telemetry Summary for Failure Analysis\n"
    files = [f for f in os.listdir(folder_path) if f.endswith(".xlsx")]

    if not files:
        return "⚠️ No Excel files found in the data folder. Please ensure the path is correct and contains .xlsx files."

    expected_cols = [
        "vbatt", "ibatt", "tbatt",
        "vpy", "vpx", "vmz", "vmx", "vpz",
        "ipy", "ipx", "imz", "imx", "ipz",
        "tpy", "tpx", "tmz", "tmx", "tpz"
    ]

    for file in files:
        filepath = os.path.join(folder_path, file)
        try:
            df = pd.read_excel(filepath)
            df_cols_lower = {col.lower(): col for col in df.columns}
            cols_to_analyze = [df_cols_lower[ec] for ec in expected_cols if ec in df_cols_lower]

            summary_report += f"\n### 📘 {file}\n"
            if not cols_to_analyze:
                summary_report += "- ⚠️ No recognized EPS columns found for analysis.\n"
                continue

            for col in cols_to_analyze:
                stats = df[col].describe()
                three_sigma = 3 * stats['std']
                summary_report += (
                    f"- **{col}**:\n"
                    f"  - Min: {stats['min']:.3f}\n"
                    f"  - Max: {stats['max']:.3f}\n"
                    f"  - Mean: {stats['mean']:.3f}\n"
                    f"  - Std: {stats['std']:.3f}\n"
                    f"  - 3-Sigma (±3σ): ±{three_sigma:.3f}\n"
                )
        except Exception as e:
            summary_report += f"- ⚠️ Error reading {file}: {e}\n"
    return summary_report

# Expose a plain descriptor dict for CrewAI's Agent which accepts dicts for tools.
data_loading_tool_def = {
    "name": "data_loading_tool",
    "description": "Reads CubeSat telemetry Excel files and computes detailed descriptive statistics, including 3-Sigma limits.",
    "func": data_loading_tool,
}


def compute_baselines(folder_path: str):
    """Compute structured baseline statistics from telemetry files.

    Returns a dict with two keys:
      - 'by_satellite': { filename: { param: {mean,std,min,max,3sigma_low,3sigma_high} }}
      - 'global': { param: {mean,std,min,max,3sigma_low,3sigma_high} } computed across all files
    """
    files = [f for f in os.listdir(folder_path) if f.endswith(".xlsx")]
    if not files:
        return {'by_satellite': {}, 'global': {}}

    per_file_stats = {}
    combined = []
    for file in files:
        filepath = os.path.join(folder_path, file)
        try:
            df = pd.read_excel(filepath)
            df = df.dropna(how='all')
            stats = {}
            for col in df.columns:
                try:
                    s = df[col].describe()
                    mean = float(s['mean']) if pd.notna(s['mean']) else None
                    std = float(s['std']) if pd.notna(s['std']) else None
                    mn = float(s['min']) if pd.notna(s['min']) else None
                    mx = float(s['max']) if pd.notna(s['max']) else None
                    if std is not None:
                        three = 3 * std
                        low = mean - three
                        high = mean + three
                    else:
                        three = None
                        low = None
                        high = None
                    stats[col.lower()] = {
                        'mean': mean, 'std': std, 'min': mn, 'max': mx,
                        '3sigma_low': low, '3sigma_high': high
                    }
                except Exception:
                    continue
            per_file_stats[file] = stats
            # append lowercased df for global aggregation
            df.columns = [c.lower() for c in df.columns]
            combined.append(df)
        except Exception:
            continue

    # global
    if combined:
        all_df = pd.concat(combined, ignore_index=True, sort=False)
        global_stats = {}
        for col in all_df.columns:
            try:
                s = all_df[col].describe()
                mean = float(s['mean']) if pd.notna(s['mean']) else None
                std = float(s['std']) if pd.notna(s['std']) else None
                mn = float(s['min']) if pd.notna(s['min']) else None
                mx = float(s['max']) if pd.notna(s['max']) else None
                if std is not None:
                    three = 3 * std
                    low = mean - three
                    high = mean + three
                else:
                    three = None
                    low = None
                    high = None
                global_stats[col] = {
                    'mean': mean, 'std': std, 'min': mn, 'max': mx,
                    '3sigma_low': low, '3sigma_high': high
                }
            except Exception:
                continue
    else:
        global_stats = {}

    return {'by_satellite': per_file_stats, 'global': global_stats}


def detect_and_explain_anomalies(sample_values: dict, baselines: dict=None, compare='global') -> str:
    """Detect anomalies for a single satellite sample and explain them.

    sample_values: mapping of parameter (like 'vbatt', 'ibatt', 'vpx', etc.) to numeric value.
    baselines: output of compute_baselines; if None, function will try to compute from './data'.
    compare: 'global' to use global baselines, or 'by_satellite' to attempt per-satellite (not used here).
    """
    if baselines is None:
        baselines = compute_baselines('./data')
    baseline = baselines.get(compare, {})

    report_lines = ["## Single-Satellite Anomaly Report\n"]
    explanations = []

    def hint_for_param(name, value, zscore):
        name = name.lower()
        if 'v' in name and 't' not in name and 'i' not in name:
            # voltage
            if zscore < -3:
                return "Voltage far below baseline — possible panel fault, disconnected cell string, or shading/contamination."
            if zscore > 3:
                return "Voltage unusually high — unexpected measurement or charging circuit anomaly."
        if name.startswith('i') or (name.startswith('ip') or name.startswith('im')):
            # current
            if zscore > 3:
                return "Current much higher than normal — possible short circuit, increased load, or fault in power distribution."
            if zscore < -3:
                return "Current much lower than normal — possible open circuit, degraded panel output, or connector loss."
        if name.startswith('t') or 'temp' in name:
            if zscore > 3:
                return "Temperature unusually high — possible thermal runaway, insufficient cooling, or anomalous heating event."
            if zscore < -3:
                return "Temperature unusually low — possible sensor miscalibration or unexpectedly cold environment."
        return None

    for param, val in sample_values.items():
        pname = param.lower()
        try:
            valf = float(val)
        except Exception:
            report_lines.append(f"- {param}: non-numeric value '{val}' — skipped")
            continue

        stats = baseline.get(pname)
        if not stats:
            report_lines.append(f"- {param}: No baseline available to compare. Value = {valf}")
            continue

        mean = stats.get('mean')
        std = stats.get('std')
        low = stats.get('3sigma_low')
        high = stats.get('3sigma_high')
        if mean is None or std is None:
            report_lines.append(f"- {param}: baseline incomplete (mean/std missing). Value = {valf}")
            continue

        z = (valf - mean) / std if std and std != 0 else None
        is_anom = False
        if z is None:
            note = f"(std==0) value={valf}, mean={mean}"
        else:
            note = f"z={z:.2f}"
            if abs(z) >= 3:
                is_anom = True

        report_lines.append(f"- {param}: value={valf:.3f}, mean={mean:.3f}, std={std:.3f}, {note}")

        if is_anom:
            hint = hint_for_param(pname, valf, z)
            explanations.append((param, valf, mean, std, z, hint))

    if explanations:
        report_lines.append("\n### Anomalies Detected:\n")
        for p, valf, mean, std, z, hint in explanations:
            report_lines.append(f"- {p}: value={valf:.3f}, mean={mean:.3f}, std={std:.3f}, z={z:.2f}")
            if hint:
                report_lines.append(f"  Explanation: {hint}")
            else:
                report_lines.append(f"  Explanation: Value deviates by {z:.2f}σ from the baseline — investigate sensor, wiring, and environmental causes.")
    else:
        report_lines.append("\nNo anomalies detected at the ±3σ threshold for the provided values.")

    return "\n".join(report_lines)


# ---------------------------
# AGENTS (Refined Goals for Interpretation)
# ---------------------------
agent1 = Agent(
    role="EPS Telemetry Data Engineer",
    # FIX: Using 'r' prefix for raw string to prevent SyntaxWarning
    goal=r"Calculate and structure comprehensive baselines (Min/Max/Mean/3σ) for all panel and battery telemetry variables for the four CubeSats (UGUISU, RAAVANA, NEPALISAT, TSURU).",
    backstory="You are a meticulous data expert, focused on preparing a clean, numeric foundation for failure analysis by ensuring all relevant EPS parameters are accurately summarized.",
    llm=gemini_llm,
    verbose=True
)
    # NOTE: tools were removed because CrewAI validates tools against an internal
    # BaseTool class which can lead to cross-package type mismatches. Keep the
    # `data_loading_tool_def` available above and call `data_loading_tool(folder_path)`
    # directly if you want the numerical summary outside of the Agent flow.

agent2 = Agent(
    role="EPS Degradation and Anomaly Detector",
    # FIX: Using 'r' prefix for raw string to prevent SyntaxWarning
    goal=r"Identify and classify statistical anomalies (> $\pm 3\sigma$) and explicitly correlate deviations in UGUISU/RAAVANA against the nominal baselines of NEPALISAT/TSURU to pinpoint the precise degradation signatures leading to panel failures.",
    backstory="You are an AI-based comparative analysis system. Your task is to contrast the telemetry of the known-failure satellites against the nominal ones to isolate the specific power generation deficits that indicate failure.",
    llm=gemini_llm,
    verbose=True
)

agent3 = Agent(
    role="Mission Control Senior EPS Designer & Analyst",
    goal="Generate an Expert EPS Design Reference Report that uses the anomaly findings to formally diagnose the panel failures, assess battery performance under stress, and derive actionable lessons learned for future 1U CubeSat EPS designs.",
    backstory="You are the senior engineer responsible for the design and long-term health of the CubeSat EPS. Your final report must translate raw data analysis into professional design recommendations and fault diagnosis.",
    llm=gemini_llm,
    verbose=True
)

# ---------------------------
# TASKS (Refined to be more interpretive and targeted)
# ---------------------------
task1 = Task(
    description="Use the 'data_loading_tool' to process all telemetry data. Compute the baseline statistics (Min, Max, Mean, Std Dev, and 3-Sigma) for all available EPS parameters (Panel V/I/T and Battery V/I/T). The output must be a detailed, structured numerical summary for all four satellites.",
    # FIX: Using 'r' prefix for raw string to prevent SyntaxWarning
    expected_output=r"A structured Markdown summary of baseline metrics, including the crucial $\pm 3\sigma$ values, for every analyzed EPS parameter for each of the four CubeSats.",
    agent=agent1
)

task2 = Task(
    # FIX: Using 'r' prefix for raw string to prevent SyntaxWarning
    description=r"Based on the detailed summary from the Data Engineer, perform a two-part analysis: 1) List any Statistical Outliers (Mean/Max outside of $\pm 3\sigma$ limits) for any satellite. 2) **Crucially, perform a Comparative Analysis:** Contrast the mean current/voltage values of UGUISU and RAAVANA panels against the mean values of NEPALISAT and TSURU to identify the clear **'Panel Degradation Signature'** consistent with a panel failure.",
    # FIX: Using 'r' prefix for raw string to prevent SyntaxWarning
    expected_output=r"A structured list of findings with two clear sections: 1. Statistical Outliers ($\pm 3\sigma$) and 2. Degradation Signatures (Comparative analysis detailing the specific panel-side current/voltage deficits on UGUISU and RAAVANA).",
    agent=agent2
)

task3 = Task(
    description="Review the Anomaly Detector's findings, especially the 'Degradation Signature'. Formally diagnose the panel failures on UGUISU and RAAVANA by detailing which telemetry confirms the failure. Then, write an **'On-Orbit EPS Design Reference Report'** for 1U CubeSat designers. The report must include an executive summary, a section on Root Cause Diagnosis, and **lessons learned and design recommendations** based on the observed degradation.",
    expected_output="A professional 'On-Orbit EPS Design Reference Report' in Markdown format, complete with an Executive Summary, Detailed Root Cause Diagnosis for UGUISU/RAAVANA failures, and actionable design recommendations for EPS redundancy and thermal management.",
    agent=agent3
)

# ---------------------------
# CREW (Sequential Execution)
# ---------------------------
crew = Crew(
    agents=[agent1, agent2, agent3],
    tasks=[task1, task2, task3],
    process=Process.sequential,
    verbose=True
)

# ---------------------------
# EXECUTION
# ---------------------------
print("🚀 Launching Multi-Agent CubeSat Failure Analysis Crew...")
# NOTE: The execution requires a local folder named 'data' containing the .xlsx files.

# Optional: if a single-satellite input is provided (JSON file or env var), analyze it
sample_report = None
baselines = compute_baselines('./data')
sample_path = os.path.join(os.getcwd(), 'satellite_input.json')
env_json = os.getenv('SAT_INPUT_JSON')
if os.path.exists(sample_path):
    try:
        import json
        with open(sample_path, 'r', encoding='utf-8') as f:
            payload = json.load(f)
        # Expecting {"name": "SAT_NAME", "values": { "vbatt":7.2, ... }}
        values = payload.get('values') or payload
        print("\n🔎 Detected 'satellite_input.json' — running single-satellite anomaly analysis...\n")
        sample_report = detect_and_explain_anomalies(values, baselines=baselines)
        print(sample_report)
    except Exception as e:
        print(f"⚠️ Failed to read or analyze satellite_input.json: {e}")
elif env_json:
    try:
        import json
        values = json.loads(env_json)
        print("\n🔎 Detected SAT_INPUT_JSON environment variable — running single-satellite anomaly analysis...\n")
        sample_report = detect_and_explain_anomalies(values, baselines=baselines)
        print(sample_report)
    except Exception as e:
        print(f"⚠️ Failed to parse SAT_INPUT_JSON: {e}")

# Pass the sample report into the crew inputs so agents can reference it if needed
inputs = {"folder_path": "./data"}
if sample_report:
    inputs['sample_anomaly_report'] = sample_report

# Allow skipping the LLM-driven crew run (helpful for testing the analyzer without exhausting LLM quota)
skip_crew = os.getenv('SKIP_CREW') or os.getenv('RUN_CREW') == '0'
if skip_crew in ("1", "true", "True"):
    print("\n⚙️ SKIP_CREW set — skipping LLM/Agent execution. Exiting after anomaly analysis.\n")
else:
    result = crew.kickoff(inputs=inputs)
    print("\n--- 🏁 Final On-Orbit EPS Design Reference Report ---\n")
    print(result)