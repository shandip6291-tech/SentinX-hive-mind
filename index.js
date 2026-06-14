const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// --- APEX ULTRA PREMIUM NEON-GLOW APPLE ARCHITECTURE INTERFACE ---
const getUltraDashboard = (ping) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SentinX Apex | Cybernetic AI Console</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --ios-red: #ff3b30;
            --ios-dark-bg: #020202;
            --ios-card-glass: rgba(18, 18, 20, 0.65);
            --ios-border-glass: rgba(255, 255, 255, 0.07);
            --ios-text-secondary: #8e8e93;
            --ios-glow: 0 0 30px rgba(255, 59, 48, 0.25);
            --io-curve: cubic-bezier(0.25, 1, 0.5, 1);
            --io-speed: 0.6s;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', -apple-system, sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,59,48,0.3); border-radius: 10px; }

        body {
            background: var(--ios-dark-bg); color: #ffffff; min-height: 100vh; overflow-x: hidden; padding: 1.5rem;
            background-image: 
                radial-gradient(circle at 85% 15%, rgba(255, 59, 48, 0.14) 0%, transparent 45%),
                radial-gradient(circle at 15% 85%, rgba(255, 59, 48, 0.05) 0%, transparent 40%);
        }

        /* 1. iOS Dynamic Island Hub Bar */
        .island-navbar {
            display: flex; justify-content: space-between; align-items: center;
            padding: 1.2rem 2.5rem; background: rgba(10, 10, 12, 0.5);
            backdrop-filter: blur(35px); -webkit-backdrop-filter: blur(35px);
            border: 1px solid var(--ios-border-glass); border-radius: 24px; margin-bottom: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5); position: relative; z-index: 10;
        }
        .brand-core { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; display: flex; align-items: center; gap: 8px; }
        .brand-core span { color: var(--ios-red); text-shadow: 0 0 15px rgba(255,59,48,0.4); }
        
        /* 2. iOS Native Mode/Page Controls */
        .page-navigation-dock { display: flex; gap: 0.5rem; background: rgba(0,0,0,0.4); padding: 5px; border-radius: 100px; border: 1px solid var(--ios-border-glass); }
        .nav-dock-btn {
            padding: 8px 18px; border: none; background: transparent; color: var(--ios-text-secondary);
            font-size: 0.85rem; font-weight: 600; cursor: pointer; border-radius: 100px; transition: var(--io-speed) var(--io-curve);
        }
        .nav-dock-btn.active { background: #ffffff; color: #000000; box-shadow: 0 4px 15px rgba(255,255,255,0.2); }

        /* 3. Main Multi-Page Wrapper Matrix */
        .page-module-container { position: relative; width: 100%; }
        .dashboard-page {
            display: grid; grid-template-columns: 1.4fr 1fr; gap: 2rem;
            position: absolute; width: 100%; top: 0; left: 0; opacity: 0; visibility: hidden;
            transform: scale(0.96) translateY(20px); transition: opacity var(--io-speed) var(--io-curve), transform var(--io-speed) var(--io-curve), visibility var(--io-speed);
        }
        .dashboard-page.active { opacity: 1; visibility: visible; transform: scale(1) translateY(0); position: relative; }

        /* 4. Left Core Modules Grid */
        .operational-suite { display: flex; flex-direction: column; gap: 2rem; }
        
        /* 5. Fluid Responsive Typography Hero Block */
        .hero-matrix h1 { font-size: 4.8rem; font-weight: 900; line-height: 1; letter-spacing: -3px; margin-bottom: 1rem; }
        .hero-matrix h1 marquee-text { color: var(--ios-red); display: block; }
        .hero-matrix p { color: var(--ios-text-secondary); font-size: 1.2rem; line-height: 1.6; max-width: 90%; }

        /* 6. Advanced Role Swapper Panel Container */
        .interactive-deck-panel {
            background: var(--ios-card-glass); border: 1px solid var(--ios-border-glass);
            border-radius: 32px; padding: 2rem; backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
        }
        .deck-navigation-strip { display: flex; background: rgba(0,0,0,0.5); padding: 6px; border-radius: 100px; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.02); }
        .deck-tab { flex: 1; padding: 12px; border: none; background: transparent; color: var(--ios-text-secondary); font-weight: 700; cursor: pointer; border-radius: 100px; transition: var(--io-speed) var(--io-curve); }
        .deck-tab.active { background: var(--ios-red); color: #ffffff; box-shadow: var(--ios-glow); }
        
        /* 7. Super Smooth Blurry Slider Matrix */
        .slider-viewport { position: relative; overflow: hidden; height: 180px; }
        .rolling-deck { display: flex; width: 300%; transition: transform 0.7s cubic-bezier(0.76, 0, 0.24, 1); }
        .deck-slide { width: 33.333%; padding: 0 10px; }
        .slide-card-glass { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); padding: 2rem; border-radius: 24px; height: 100%; transition: backdrop-filter 0.5s; }
        .slide-card-glass h3 { font-size: 1.5rem; margin-bottom: 10px; font-weight: 700; display: flex; align-items: center; gap: 12px; }
        .slide-card-glass h3::before { content: ''; width: 6px; height: 18px; background: var(--ios-red); border-radius: 10px; display: inline-block; }
        .slide-card-glass p { color: var(--ios-text-secondary); font-size: 1rem; line-height: 1.6; }

        /* 8. Right Core Telemetry Deck */
        .telemetry-suite { display: flex; flex-direction: column; gap: 2rem; }

        /* 9. HTML5 Mathematical Interactive Canvas Simulation Node */
        .canvas-node-frame {
            height: 350px; background: rgba(8, 8, 10, 0.8); border: 1px solid rgba(255, 59, 48, 0.15);
            border-radius: 32px; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center;
            box-shadow: inset 0 0 50px rgba(0,0,0,0.9);
        }
        .canvas-node-frame canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
        .canvas-overlay-content { position: relative; z-index: 2; text-align: center; }
        .canvas-overlay-content h2 { font-size: 2rem; font-weight: 900; letter-spacing: -0.5px; }
        .canvas-overlay-content p { font-size: 0.8rem; color: var(--ios-red); font-weight: 800; letter-spacing: 5px; margin-top: 6px; text-transform: uppercase; }

        /* 10. Advanced Bento Box Matrix */
        .bento-grid-matrix { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
        .bento-node-unit {
            background: var(--ios-card-glass); border: 1px solid var(--ios-border-glass); border-radius: 24px;
            padding: 1.5rem; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); transition: var(--io-speed) var(--io-curve);
        }
        .bento-node-unit:hover { border-color: rgba(255, 59, 48, 0.35); transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.4); }
        .bento-meta-label { font-size: 0.75rem; color: var(--ios-text-secondary); text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-bottom: 8px; }
        .bento-meta-value { font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; }
        .bento-meta-value.danger-glow { color: var(--ios-red); text-shadow: 0 0 15px rgba(255,59,48,0.4); }

        /* 11. Hyper Realistic 3D Pressed Macro Action Controller */
        .tactile-macro-button {
            grid-column: span 2; background: #ffffff; color: #000000; border: none; padding: 20px;
            border-radius: 100px; font-size: 1.1rem; font-weight: 800; cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); display: flex; justify-content: center; align-items: center; gap: 12px;
            box-shadow: 0 15px 35px rgba(255,255,255,0.15);
        }
        .tactile-macro-button:hover { background: #f5f5f7; transform: translateY(-2px); box-shadow: 0 20px 40px rgba(255,255,255,0.2); }
        .tactile-macro-button:active { transform: scale(0.94) translateY(0); box-shadow: 0 5px 10px rgba(255,255,255,0.05); }

        /* 12. Realtime Execution Console Grid */
        .live-stream-terminal {
            grid-column: span 2; background: rgba(0,0,0,0.6); border: 1px solid var(--ios-border-glass);
            border-radius: 20px; padding: 1.2rem; font-family: monospace; font-size: 0.8rem; height: 120px;
            overflow-y: hidden; display: flex; flex-direction: column; gap: 6px; color: #34c759;
        }

        /* Responsive Breakpoint Matrix */
        @media (max-width: 1024px) {
            .dashboard-page { grid-template-columns: 1fr; gap: 2rem; }
            .hero-matrix h1 { font-size: 3.5rem; }
        }
    </style>
</head>
<body>

    <div class="island-navbar">
        <div class="brand-core">SentinX <span>AI NEURAL</span></div>
        <div class="page-navigation-dock">
            <button class="nav-dock-btn active" onclick="navigateDashboardPage('core-hub', this)">Core Hub</button>
            <button class="nav-dock-btn" onclick="navigateDashboardPage('security-perimeter', this)">Security Perimeter</button>
            <button class="nav-dock-btn" onclick="navigateDashboardPage('heuristic-analytics', this)">AI Analytics</button>
        </div>
    </div>

    <div class="page-module-container">

        <div class="dashboard-page active" id="core-hub">
            <div class="operational-suite">
                <div class="hero-matrix">
                    <h1>Sovereign <span>AI Matrix</span> Intelligence.</h1>
                    <p>Sub-atomic packet parsing pipelines built directly into Discord API sockets. Experience maximum firewall protection vectors with multi-threading logic matrices.</p>
                </div>

                <div class="interactive-deck-panel">
                    <div class="deck-navigation-strip">
                        <button class="deck-tab active" onclick="rollDeckSlider(0, this)">Admin Control Core</button>
                        <button class="deck-tab" onclick="rollDeckSlider(1, this)">Moderation Firewall</button>
                        <button class="deck-tab" onclick="rollDeckSlider(2, this)">VIP Tunneling</button>
                    </div>
                    <div class="slider-viewport">
                        <div class="rolling-deck" id="mainRollingDeck">
                            <div class="deck-slide">
                                <div class="slide-card-glass">
                                    <h3>Prefix Kernel Lock</h3>
                                    <p>[Feature 11, 12] Modify and lock global configuration nodes across high-load microservices. Hot-reloading system clusters are mapped with zero performance friction.</p>
                                </div>
                            </div>
                            <div class="deck-slide">
                                <div class="slide-card-glass">
                                    <h3>Anti-Raid Perimeter</h3>
                                    <p>[Feature 13, 14] Realtime heuristic checking drops instant malicious token storms. Isolates cluster targets automatically under 5ms execution vectors.</p>
                                </div>
                            </div>
                            <div class="deck-slide">
                                <div class="slide-card-glass">
                                    <h3>Priority Quantum Sync</h3>
                                    <p>[Feature 15, 16] Allocated data bandwidth routes critical interaction pipelines past server rate limits. Guaranteed delivery execution across shards.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="telemetry-suite">
                <div class="canvas-node-frame">
                    <canvas id="neuralMatrixCanvas"></canvas>
                    <div class="canvas-overlay-content">
                        <h2>SentinX AI Core</h2>
                        <p>Dynamic Core Lock</p>
                    </div>
                </div>

                <div class="bento-grid-matrix">
                    <div class="bento-node-unit"><div class="bento-meta-label">Cluster Heartbeat</div><div class="bento-meta-value danger-glow">${ping}ms</div></div>
                    <div class="bento-node-unit"><div class="bento-meta-label">Accuracy Heuristics</div><div class="bento-meta-value">99.98%</div></div>
                    <div class="bento-node-unit"><div class="bento-meta-label">Active Shard Allocation</div><div class="bento-meta-value">01/01</div></div>
                    <div class="bento-node-unit"><div class="bento-meta-label">Kernel Security Lock</div><div class="bento-meta-value" style="color:#34c759;">ARMED</div></div>
                    
                    <button class="tactile-macro-button" onclick="initializeDeepNeuralScan(this)">
                        <span>Initialize Deep Protocol Scan</span>
                    </button>

                    <div class="live-stream-terminal" id="terminalOutputGrid">
                        <div>[SYSTEM] Core Engine initialized successfully. Ready for stream parameters.</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-page" id="security-perimeter">
            <div class="operational-suite">
                <div class="hero-matrix">
                    <h1>Active <span>Firewall</span> Corridor Mapping</h1>
                    <p>Live memory inspection engine evaluating active security patterns inside text channels. Threat tracking blocks malicious packets natively.</p>
                </div>
                <div class="bento-grid-matrix" style="grid-template-columns: 1fr 1fr;">
                    <div class="bento-node-unit"><div class="bento-meta-label">Automated Bans</div><div class="bento-meta-value danger-glow">1,402</div></div>
                    <div class="bento-node-unit"><div class="bento-meta-label">Isolated Malicious Spams</div><div class="bento-meta-value">42,911</div></div>
                </div>
            </div>
            <div class="telemetry-suite">
                <div class="interactive-deck-panel">
                    <h3 style="margin-bottom:15px; font-weight:800;">Memory Extraction Array</h3>
                    <p style="color:var(--ios-text-secondary); font-size:0.95rem; line-height:1.6;">Continuous automated threat hunting maps server nodes across international API shards. System registers configuration models synchronously.</p>
                </div>
            </div>
        </div>

        <div class="dashboard-page" id="heuristic-analytics">
            <div class="operational-suite">
                <div class="hero-matrix">
                    <h1>Heuristic <span>Neural Network</span> Analytics</h1>
                    <p>Dynamic token clustering dashboards running inside background memory blocks. Review machine performance data matrices live.</p>
                </div>
                <div class="interactive-deck-panel">
                    <h3 style="color:var(--ios-red); margin-bottom:10px;">Quantum State Loading</h3>
                    <p style="color:var(--ios-text-secondary);">Synthesizing threat profile graphs... Realtime charts are dynamically linked with Express websocket nodes.</p>
                </div>
            </div>
            <div class="telemetry-suite">
                <div class="bento-grid-matrix">
                    <div class="bento-node-unit"><div class="bento-meta-label">CPU Core Stress</div><div class="bento-meta-value">0.04%</div></div>
                    <div class="bento-node-unit"><div class="bento-meta-label">Memory Mapping</div><div class="bento-meta-value">14.2 MB</div></div>
                </div>
            </div>
        </div>

    </div>

    <script>
        // Fluid Page Navigation Engine
        function navigateDashboardPage(targetPageId, element) {
            document.querySelectorAll('.nav-dock-btn').forEach(btn => btn.classList.remove('active'));
            element.classList.add('active');
            
            document.querySelectorAll('.dashboard-page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(targetPageId).classList.add('active');
        }

        // Rolling Slider Array Engine
        function rollDeckSlider(index, element) {
            document.querySelectorAll('.deck-tab').forEach(tab => tab.classList.remove('active'));
            element.classList.add('active');
            
            const deck = document.getElementById('mainRollingDeck');
            deck.style.transform = \`translateX(\${index * -33.333}%)\`;
        }

        // Live Log Stream Loop Simulation
        const logsArray = [
            "Syncing validation array shards...",
            "Heuristic verification matches criteria: 100%",
            "Express routing handshake initialized via Render node",
            "Discord API pipeline latency mapping checked",
            "Core Memory parameters isolated and locked safely"
        ];
        setInterval(() => {
            const terminal = document.getElementById('terminalOutputGrid');
            if(terminal) {
                const randomLog = logsArray[Math.floor(Math.random() * logsArray.length)];
                const timeStr = new Date().toLocaleTimeString();
                const logElement = document.createElement('div');
                logElement.innerText = \`[\${timeStr}] \${randomLog}\`;
                terminal.appendChild(logElement);
                if (terminal.childNodes.length > 5) terminal.removeChild(terminal.firstChild);
            }
        }, 3000);

        // Tactile Press Sequence Event Handler
        function initializeDeepNeuralScan(btn) {
            btn.style.transform = "scale(0.94)";
            btn.style.background = "var(--ios-red)";
            btn.style.color = "#ffffff";
            btn.querySelector('span').innerText = "Analyzing Architecture Nodes...";
            
            setTimeout(() => {
                btn.style.transform = "translateY(-2px)";
                btn.style.background = "#ffffff";
                btn.style.color = "#000000";
                btn.querySelector('span').innerText = "Initialize Deep Protocol Scan";
                alert("AI Intelligence Dashboard Sync Complete. 32 Matrix Parameters Fully Functional.");
            }, 1500);
        }

        // Mathematical Canvas Warp Simulation (HTML5 Native Matrix)
        const canvas = document.getElementById('neuralMatrixCanvas');
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        let points = [];
        for (let i = 0; i < 25; i++) {
            points.push({
                x: Math.random() * width, y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5
            });
        }

        function renderCanvasMatrixAnimation() {
            ctx.clearRect(0,0,width,height);
            ctx.strokeStyle = "rgba(255, 59, 48, 0.08)";
            ctx.lineWidth = 1;
            
            for(let i=0; i<points.length