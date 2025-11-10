# CubeSat EPS Failure Analysis (crew_ai)

This repository contains a multi-agent CrewAI-driven project for analyzing CubeSat Electrical Power System (EPS) telemetry, detecting anomalies, and generating mission health & design reports.

Key features

- Compute baseline statistics (Min, Max, Mean, Std, ±3σ) across telemetry files in `./data`.
- Single-satellite anomaly detection + human-readable explanations (accepts a JSON input).
- Multi-agent pipeline (CrewAI) that uses LLMs to synthesize findings into professional reports.

Files of interest

- `main.py` — main entrypoint. Contains baseline computation, single-satellite analyzer, and multi-agent crew orchestration.
- `satellite_input.json` — optional sample input file (project root). When present, `main.py` will run the single-satellite analyzer and print an anomaly report.
- `data/` — place telemetry `.xlsx` files here for baseline computation.

Quick start (Windows PowerShell)

1. Create a Python virtual environment (recommended):

```powershell
python -m venv .env
# Activate the virtual environment
.\.env\Scripts\Activate.ps1
```

2. Install dependencies (create `requirements.txt` or install manually). Example:

```powershell
pip install -r requirements.txt
# OR install packages used in this repo
pip install crewai langchain-google-genai pandas python-dotenv openpyxl
```

3. Add your telemetry Excel files to `./data`.

4. (Optional) Provide a single-satellite input file `satellite_input.json` at the project root. Example format:

```json
{
  "name": "UGUISU",
  "values": {
    "vbatt": 7.2,
    "ibatt": 0.65,
    "tbatt": 23.5,
    "vpx": 3.12,
    "ipx": 0.05,
    "tpx": 21.0
  }
}
```

5. Set environment variables (if needed):

- `GEMINI_API_KEY` — required for CrewAI to call the Google Gemini/Vertex model.
- `SAT_INPUT_JSON` — alternatively provide sample JSON directly as an environment variable.
- `SKIP_CREW=1` — skip LLM/Agent run (useful for offline testing of analyzer without exhausting API quota).

6. Run the script:

```powershell
C:/path/to/your/venv/Scripts/python.exe main.py
# or, if your venv is activated:
python main.py
```

Behavior

- If `satellite_input.json` (or `SAT_INPUT_JSON`) is present, the script will run the single-satellite analyzer and print a human-readable anomaly report.
- If `SKIP_CREW=1` is set, the script will skip the CrewAI LLM agents and exit after printing the analyzer output.
- Otherwise the full multi-agent crew will run and produce a final report (this will call LLM APIs and may consume quota).

Security & secrets

- Put API keys and secrets in a `.env` file (loaded by `python-dotenv`) or environment variables. Do NOT commit `.env` or your virtual environment to source control.

Creating a `requirements.txt`

To capture your environment's dependencies after installing the packages you need:

```powershell
pip freeze > requirements.txt
```

Contributing

Issues, improvements to anomaly heuristics, ML-backed anomaly detectors, or nicer report output are welcome. If you want Agents to invoke tools directly, we'll need to align the tool objects with the CrewAI expected `BaseTool` API/version.

License

Pick a license for the repository (e.g., MIT) and add it as `LICENSE` if you intend to publish.

---

If you'd like, I can also:

- Add a `requirements.txt` generated from your current environment.
- Add a minimal CLI wrapper to `main.py` (argparse) so you can call `--sample satellite_input.json` or `--skip-crew` directly.
- Create GitHub Actions workflow for basic linting/tests.
