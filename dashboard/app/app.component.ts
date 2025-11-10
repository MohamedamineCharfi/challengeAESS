import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="display: flex; min-height: 100vh; background: #0a0e27;">
      <!-- Sidebar -->
      <div style="width: 250px; background: linear-gradient(180deg, #0f1729 0%, #1a2744 100%); border-right: 1px solid rgba(59, 130, 246, 0.2); padding: 2rem 0; color: #e6eef8; overflow-y: auto;">
        <div style="padding: 0 1.5rem; margin-bottom: 2rem;">
          <h2 style="margin: 0; font-size: 1.3rem; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">CUBESAT</h2>
          <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: rgba(230, 238, 248, 0.5); text-transform: uppercase; letter-spacing: 1px;">Dashboard</p>
        </div>
        
        <nav style="padding: 0;">
          <div style="padding: 0.75rem 1.5rem; border-left: 3px solid #3b82f6; background: rgba(59, 130, 246, 0.1); cursor: pointer; color: #3b82f6; font-weight: 600;">📊 Dashboard</div>
          <div style="padding: 0.75rem 1.5rem; cursor: pointer; color: rgba(230, 238, 248, 0.6); transition: all 0.2s;" onmouseover="this.style.background='rgba(59, 130, 246, 0.05)'" onmouseout="this.style.background='transparent'">🛰️ Satellites</div>
          <div style="padding: 0.75rem 1.5rem; cursor: pointer; color: rgba(230, 238, 248, 0.6); transition: all 0.2s;" onmouseover="this.style.background='rgba(59, 130, 246, 0.05)'" onmouseout="this.style.background='transparent'">📈 Analytics</div>
          <div style="padding: 0.75rem 1.5rem; cursor: pointer; color: rgba(230, 238, 248, 0.6); transition: all 0.2s;" onmouseover="this.style.background='rgba(59, 130, 246, 0.05)'" onmouseout="this.style.background='transparent'">⚙️ Settings</div>
        </nav>
      </div>

      <!-- Main Content -->
      <div style="flex: 1; overflow-y: auto;">
        <!-- Header -->
        <div style="background: linear-gradient(90deg, rgba(15, 23, 42, 0.6) 0%, rgba(26, 39, 68, 0.6) 100%); border-bottom: 1px solid rgba(59, 130, 246, 0.15); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; color: #e6eef8;">
          <h1 style="margin: 0; font-size: 2rem;">PHOENIX - CubeSat Monitor</h1>
          <div style="display: flex; gap: 1.5rem; align-items: center;">
            <span style="font-size: 1.2rem;">🔔</span>
            <span style="font-size: 1.2rem;">👤</span>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 2rem; color: #e6eef8;">
          <!-- Space Background SVG -->
          <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(26, 39, 68, 0.5) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 2rem; margin-bottom: 2rem; overflow: hidden;">
            <h3 style="margin: 0 0 1.5rem 0; font-size: 1.2rem; color: #e6eef8; text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">🌌</span>
              Orbital Network - Real-time Constellation
            </h3>
            <svg viewBox="0 0 800 300" style="width: 100%; height: 300px; display: block;">
              <!-- Background gradient -->
              <defs>
                <radialGradient id="spaceGrad" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#0a0e27;stop-opacity:1" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <!-- Fill background -->
              <rect width="800" height="300" fill="url(#spaceGrad)"/>
              
              <!-- Orbital lines -->
              <circle cx="400" cy="150" r="80" fill="none" stroke="rgba(59, 130, 246, 0.2)" stroke-width="1" stroke-dasharray="5,5"/>
              <circle cx="400" cy="150" r="120" fill="none" stroke="rgba(139, 92, 246, 0.15)" stroke-width="1" stroke-dasharray="8,4"/>
              <circle cx="400" cy="150" r="160" fill="none" stroke="rgba(59, 130, 246, 0.1)" stroke-width="1" stroke-dasharray="5,5"/>
              
              <!-- Central star -->
              <circle cx="400" cy="150" r="8" fill="#06b6d4" filter="url(#glow)"/>
              <circle cx="400" cy="150" r="12" fill="none" stroke="#06b6d4" stroke-width="1" opacity="0.5"/>
              
              <!-- Satellites/nodes -->
              <circle cx="480" cy="150" r="6" fill="#3b82f6" filter="url(#glow)"/>
              <circle cx="320" cy="150" r="5" fill="#8b5cf6" filter="url(#glow)"/>
              <circle cx="400" cy="80" r="5" fill="#16a34a" filter="url(#glow)"/>
              <circle cx="400" cy="220" r="5" fill="#f59e0b" filter="url(#glow)"/>
              
              <!-- Connection lines -->
              <line x1="400" y1="150" x2="480" y2="150" stroke="rgba(59, 130, 246, 0.3)" stroke-width="1"/>
              <line x1="400" y1="150" x2="320" y2="150" stroke="rgba(139, 92, 246, 0.3)" stroke-width="1"/>
              <line x1="400" y1="150" x2="400" y2="80" stroke="rgba(22, 163, 74, 0.3)" stroke-width="1"/>
              <line x1="400" y1="150" x2="400" y2="220" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1"/>
              
              <!-- Stars scattered -->
              <circle cx="100" cy="50" r="1.5" fill="#ffffff" opacity="0.7"/>
              <circle cx="150" cy="80" r="1" fill="#ffffff" opacity="0.5"/>
              <circle cx="200" cy="40" r="1.5" fill="#ffffff" opacity="0.6"/>
              <circle cx="700" cy="60" r="1" fill="#ffffff" opacity="0.5"/>
              <circle cx="750" cy="100" r="1.5" fill="#ffffff" opacity="0.7"/>
              <circle cx="680" cy="250" r="1" fill="#ffffff" opacity="0.6"/>
              <circle cx="100" cy="250" r="1.5" fill="#ffffff" opacity="0.5"/>
              <circle cx="650" cy="150" r="1" fill="#ffffff" opacity="0.4"/>
              
              <!-- Constellation lines -->
              <line x1="100" y1="50" x2="150" y2="80" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <line x1="150" y1="80" x2="200" y2="40" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <line x1="700" y1="60" x2="750" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            </svg>
          </div>

          <!-- Title -->
          <div style="margin-bottom: 2rem;">
            <h2 style="margin: 0 0 0.5rem 0; font-size: 1.8rem;">Dashboard</h2>
            <p style="margin: 0; color: rgba(230, 238, 248, 0.6); font-size: 0.9rem;">Real-time CubeSat monitoring</p>
          </div>

          <!-- CubeSat Card with Image -->
          <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 2rem; margin-bottom: 2rem;">
            <h2 style="margin: 0 0 1.5rem 0; font-size: 1.5rem; color: #e6eef8; text-transform: uppercase; letter-spacing: 2px;">Digital Twin - PHOENIX</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
              <!-- Left: Image and Health -->
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.3); border-radius: 12px; padding: 2rem;">
                <img src="/generated-image.png" alt="PHOENIX CubeSat" style="width: 100%; max-width: 300px; height: auto; margin-bottom: 1.5rem; filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.5));">
                <div style="text-align: center;">
                  <div style="font-size: 0.9rem; color: rgba(230, 238, 248, 0.6); margin-bottom: 0.5rem;">Health Status</div>
                  <div style="font-size: 3rem; font-weight: 700; background: linear-gradient(135deg, #3b82f6 0%, #16a34a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">85%</div>
                </div>
              </div>

              <!-- Right: Metrics -->
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div style="background: rgba(59, 130, 246, 0.1); border-left: 3px solid #3b82f6; border-radius: 8px; padding: 1.5rem;">
                  <p style="margin: 0 0 0.5rem 0; color: rgba(230, 238, 248, 0.6); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Orbit Position</p>
                  <p style="margin: 0; font-size: 1.8rem; font-weight: 700; color: #3b82f6;">9.6°</p>
                  <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem; color: rgba(230, 238, 248, 0.5);">Orbital inclination</p>
                </div>

                <div style="background: rgba(59, 130, 246, 0.1); border-left: 3px solid #8b5cf6; border-radius: 8px; padding: 1.5rem;">
                  <p style="margin: 0 0 0.5rem 0; color: rgba(230, 238, 248, 0.6); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Status</p>
                  <p style="margin: 0; font-size: 1.2rem; font-weight: 700; color: #16a34a;">OPERATIONAL</p>
                  <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem; color: rgba(230, 238, 248, 0.5);">All systems nominal</p>
                </div>

                <div style="background: rgba(59, 130, 246, 0.1); border-left: 3px solid #06b6d4; border-radius: 8px; padding: 1.5rem;">
                  <p style="margin: 0 0 0.5rem 0; color: rgba(230, 238, 248, 0.6); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Altitude</p>
                  <p style="margin: 0; font-size: 1.8rem; font-weight: 700; color: #06b6d4;">Nominal</p>
                  <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem; color: rgba(230, 238, 248, 0.5);">Stable orbit maintained</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row -->
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
            <!-- Health Trend Chart -->
            <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 1.5rem;">
              <h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; color: #e6eef8;">PHOENIX Health Trend</h3>
              <svg viewBox="0 0 400 150" style="width: 100%; height: 150px;">
                <!-- Grid -->
                <line x1="40" y1="130" x2="390" y2="130" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                <line x1="40" y1="100" x2="390" y2="100" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                <line x1="40" y1="70" x2="390" y2="70" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                <line x1="40" y1="40" x2="390" y2="40" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                
                <!-- TSURU line -->
                <polyline points="50,75 120,70 190,65 260,60 330,55 390,50" stroke="#3b82f6" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                
                <!-- Dots -->
                <circle cx="50" cy="75" r="5" fill="#3b82f6" opacity="0.6"/>
                <circle cx="390" cy="50" r="5" fill="#3b82f6"/>
                
                <!-- Legend -->
                <text x="50" y="145" font-size="10" fill="rgba(230,238,248,0.6)">24h ago</text>
                <text x="350" y="145" font-size="10" fill="rgba(230,238,248,0.6)">Now</text>
              </svg>
              <div style="margin-top: 1rem; text-align: center; font-size: 0.9rem; color: #3b82f6;">
                ● Current: 85% | Trend: Stable
              </div>
            </div>

            <!-- System Status Donut -->
            <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; color: #e6eef8; align-self: flex-start;">System Status</h3>
              <svg viewBox="0 0 120 120" style="width: 100px; height: 100px;">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#16a34a" stroke-width="18"/>
                <text x="60" y="65" text-anchor="middle" font-size="24" fill="#e6eef8" font-weight="bold">85%</text>
              </svg>
              <div style="margin-top: 1.5rem; font-size: 0.85rem; text-align: center;">
                <p style="margin: 0.5rem 0; color: #16a34a; font-weight: 700;">✓ All Systems</p>
                <p style="margin: 0.5rem 0; color: rgba(230, 238, 248, 0.6);">Nominal</p>
              </div>
            </div>
          </div>

          <!-- Digital Twin Prediction -->
          <div style="margin-bottom: 2rem;">
            <h3 style="margin: 0 0 1.5rem 0; font-size: 1.2rem; color: #e6eef8; text-transform: uppercase; letter-spacing: 1px;">Digital Twin Prediction</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <!-- Without Intervention -->
              <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(148, 51, 51, 0.1) 100%); border: 2px solid rgba(239, 68, 68, 0.4); border-radius: 12px; padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                  <span style="font-size: 1.5rem;">⚠️</span>
                  <h4 style="margin: 0; font-size: 1.1rem; color: #ef4444; font-weight: 700;">Without Intervention</h4>
                </div>
                <div style="background: rgba(239, 68, 68, 0.05); border-radius: 8px; padding: 1.25rem;">
                  <p style="margin: 0.5rem 0; color: #ef4444; font-size: 0.95rem; font-weight: 600;">🔋 Battery failure in 8 hours</p>
                  <p style="margin: 0.5rem 0; color: #fca5a5; font-size: 0.9rem;">Critical power depletion detected</p>
                  <p style="margin: 0.5rem 0; color: #ef4444; font-size: 0.95rem; font-weight: 600;">💰 Mission loss: $2M</p>
                </div>
              </div>

              <!-- With Intervention -->
              <div style="background: linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(20, 83, 45, 0.1) 100%); border: 2px solid rgba(22, 163, 74, 0.4); border-radius: 12px; padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                  <span style="font-size: 1.5rem;">✅</span>
                  <h4 style="margin: 0; font-size: 1.1rem; color: #16a34a; font-weight: 700;">With Intervention</h4>
                </div>
                <div style="background: rgba(22, 163, 74, 0.05); border-radius: 8px; padding: 1.25rem;">
                  <p style="margin: 0.5rem 0; color: #16a34a; font-size: 0.95rem; font-weight: 600;">📈 Battery stabilizes</p>
                  <p style="margin: 0.5rem 0; color: #86efac; font-size: 0.9rem;">Power management optimized</p>
                  <p style="margin: 0.5rem 0; color: #16a34a; font-size: 0.95rem; font-weight: 600;">⏱️ Mission extended: +21 days</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class AppComponent {}


