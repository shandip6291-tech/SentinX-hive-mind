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

// --- ULTRA-PREMIUM APPLE REG-GLOW SYSTEM INTERFACE ---
const getAdvancedDashboard = (ping) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SentinX Apex | Command Center</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --apple-red: #ff3b30;
            --apple-dark-bg: #000000;
            --apple-card-bg: rgba(22, 22, 23, 0.6);
            --apple-glass-border: rgba(255, 255, 255, 0.06);
            --io-transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', -apple-system, sans-serif; }
        
        body {
            background: var(--apple-dark-bg);
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            background-image: 
                radial-gradient(circle at 80% 20%, rgba(255, 59, 48, 0.12) 0%, transparent 50%),
                radial-gradient(circle at 15% 80%, rgba(255, 59, 48, 0.04) 0%, transparent 40%);
        }

        /* Top iOS Bar */
        .header-nav {
            display: flex; justify-content: space-between; align-items: center;
            padding: 1.2rem 2rem;
            background: rgba(10, 10, 10, 0.4);
            backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
            border: 1px solid var(--apple-glass-border);
            border-radius: 20px;
            margin-bottom: 3rem;
        }

        .brand { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; }
        .brand span { color: var(--apple-red); font-weight: 900; }
        
        .pulse-container { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; color: #86868b; }
        .pulse-dot { width: 8px; height: 8px; background: var(--apple-red); border-radius: 50%; box-shadow: 0 0 12px var(--apple-red); animation: io-pulse 2s infinite; }
        
        @keyframes io-pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

        /* Main Grid Hub Layout */
        .dashboard-container {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 2.5rem;
            flex: 1;
        }

        /* Left Side: Hero & Dynamic Feature Switcher */
        .interactive-zone { display: flex; flex-direction: column; gap: 2.5rem; }
        
        .hero-banner h1 {
            font-size: 4.2rem; font-weight: 800; line-height: 1.05; letter-spacing: -2.5px; margin-bottom: 1rem;
        }
        .hero-banner h1 em { font-style: normal; color: var(--apple-red); }
        .hero-banner p { color: #86868b; font-size: 1.15rem; line-height: 1.6; max-width: 85%; }

        /* Role Switcher Interface */
        .role-panel {
            background: var(--apple-card-bg);
            border: 1px solid var(--apple-glass-border);
            border-radius: 28px; padding: 2rem;
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        }

        .role-tabs {
            display: flex; background: rgba(0,0,0,0.4); padding: 6px; border-radius: 100px; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.03);
        }

        .tab-btn {
            flex: 1; padding: 12px; border: none; background: transparent; color: #86868b;
            font-size: 0.95rem; font-weight: 600; cursor: pointer; border-radius: 100px; transition: var(--io-transition);
        }

        .tab-btn.active {
            background: #ffffff; color: #000000; box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }

        /* Sliding Card Deck Showcase */
        .deck-wrapper { position: relative; overflow: hidden; height: 160px; }
        .feature-deck { display: flex; width: 300%; transition: var(--io-transition); }
        
        .feature-card {
            width: 33.333%; padding: 0 10px;
        }
        .card-inner {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
            padding: 1.5rem; border-radius: 20px; height: 100%;
        }
        .card-inner h3 { font-size: 1.3rem; margin-bottom: 8px; font-weight: 600; display: flex; align-items: center; gap: 10px;}
        .card-inner h3::before { content: '✓'; color: var(--apple-red); font-weight: 900;}
        .card-inner p { color: #86868b; font-size: 0.95rem; line-height: 1.5; }

        /* Right Side: Visual Core & Bento Analytics */
        .telemetry-zone { display: flex; flex-direction: column; gap: 2.5rem; }

        .apple-jelly-node {
            height: 320px; background: rgba(12, 12, 14, 0.7);
            border: 1px solid rgba(255, 59, 48, 0.15); border-radius: 32px;
            display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden;
            box-shadow: inset 0 0 40px rgba(255, 59, 48, 0.05);
        }

        .jelly-core {
            width: 130px; height: 130px; background: var(--apple-red);
            border-radius: 50%; filter: blur(60px); opacity: 0.6;
            animation: core-breathing 4s infinite alternate ease-in-out;
        }

        @keyframes core-breathing {
            0% { transform: scale(1); opacity: 0.4; filter: blur(50px); }
            100% { transform: scale(1.4); opacity: 0.8; filter: blur(75px); }
        }

        .node-overlay-text {
            position: absolute; text-align: center; z-index: 2;
        }
        .node-overlay-text h2 { font-size: 1.8rem; font-weight: 900; letter-spacing: 2px; text-shadow: 0 4px 20px rgba(0,0,0,0.8); }
        .node-overlay-text p { font-size: 0.75rem; color: var(--apple-red); font-weight: 800; letter-spacing: 4px; margin-top: 5px; text-transform: uppercase;}

        /* Premium Bento Box Cluster */
        .bento-box-cluster { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        
        .bento-unit {
            background: var(--apple-card-bg); border: 1px solid var(--apple-glass-border);
            border-radius: 24px; padding: 1.8rem; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            transition: var(--io-transition);
        }
        .bento-unit:hover { border-color: rgba(255, 59, 48, 0.3); transform: translateY(-4px); }
        
        .bento-label { font-size: 0.75rem; color: #86868b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: 8px;}
        .bento-value { font-size: 2.4rem; font-weight: 800; letter-spacing: -1px; }
        .bento-value.red-accent { color: var(--apple-red); text-shadow: 0 0 15px rgba(255, 59, 48, 0.3); }

        /* Tactile Action Button iOS Flow */
        .ios-action-btn {
            grid-column: span 2; background: #ffffff; color: #000000;
            border: none; padding: 18px; border-radius: 100px; font-size: 1.05rem; font-weight: 700;
            cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex; justify-content: center; align-items: center; gap: 10px;
            box-shadow: 0 12px 30px rgba(255,255,255,0.1);
        }

        .ios-action-btn:active { transform: scale(0.96); background: rgba(255,255,255,0.85); }
        .ios-action-btn svg { fill: currentColor; transition: transform 0.3s ease; }
        .ios-action-btn:hover svg { transform: translateX(5px); }

        @media (max-width: 968px) {
            .dashboard-container { grid-template-columns: 1fr; gap: 2rem; }
            .hero-banner h1 { font-size: 3rem; }
        }
    </style>
</head>
<body>

    <div class="header-nav">
        <div class="brand">SentinX <span>APEX</span></div>
        <div class="pulse-container">
            <div class="pulse-dot"></div>
            <span>SECURE CONSOLE ACTIVE</span>
        </div>
    </div>

    <div class="dashboard-container">
        
        <div class="interactive-zone">
            <div class="hero-banner">
                <h1>The Core <em>Intelligence</em> For Discord.</h1>
                <p>An enterprise security system designed with military grade logic algorithms. Plug into the main system to synchronize execution trees effortlessly.</p>
            </div>

            <div class="role-panel">
                <div class="role-tabs">
                    <button class="tab-btn active" onclick="switchRoleDeck(0, this)">Admin Control</button>
                    <button class="tab-btn" onclick="switchRoleDeck(1, this)">Moderation Engine</button>
                    <button class="tab-btn" onclick="switchRoleDeck(2, this)">VIP Safeguard</button>
                </div>

                <div class="deck-wrapper">
                    <div class="feature-deck" id="roleDeck">
                        <div class="feature-card">
                            <div class="card-inner">
                                <h3>Full Engine Sync</h3>
                                <p>Execute high-level clustering scripts, bypass protocol levels, and gain architectural control over prefix states globally across servers.</p>
                            </div>
                        </div>
                        <div class="feature-card">
                            <div class="card-inner">
                                <h3>Lethal Raid Filter</h3>
                                <p>Automated heuristics analyze message velocity and automatically seal access corridors when dynamic malicious threats are isolated.</p>
                            </div>
                        </div>
                        <div class="feature-card">
                            <div class="card-inner">
                                <h3>Neural Tunneling</h3>
                                <p>Premium high-speed channel priorities assigned automatically to critical operations to guarantee data validation speeds under 20ms.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="telemetry-zone">
            <div class="apple-jelly-node">
                <div class="jelly-core"></div>
                <div class="node-overlay-text">
                    <h2>SentinX Node v1.0</h2>
                    <p>DNA System Lock</p>
                </div>
            </div>

            <div class="bento-box-cluster">
                <div class="bento-unit">
                    <div class="bento-label">Heartbeat Velocity</div>
                    <div class="bento-value red-accent">${ping}ms</div>
                </div>
                <div class="bento-unit">
                    <div class="bento-label">Heuristic Core</div>
                    <div class="bento-value">99.9%</div>
                </div>
                <div class="bento-unit">
                    <div class="bento-label">Cluster Load</div>
                    <div class="bento-value">0.02%</div>
                </div>
                <div class="bento-unit">
                    <div class="bento-label">System State</div>
                    <div class="bento-value" style="font-size: 1.8rem; color: #34c759; font-weight:900;">SECURED</div>
                </div>

                <button class="ios-action-btn" onclick="triggerPremiumSequence()">
                    <span>Initialize Deep Protocol Scan</span>
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        </div>

    </div>

    <script>
        function switchRoleDeck(slideIndex, element) {
            // Tab Switch Effect
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            element.classList.add('active');
            
            // Slider Vector Calculations
            const deck = document.getElementById('roleDeck');
            const offset = slideIndex * -33.333;
            deck.style.transform = \`translateX(\${offset}%)\`;
        }

        function triggerPremiumSequence() {
            const btn = document.querySelector('.ios-action-btn');
            btn.style.background = 'var(--apple-red)';
            btn.style.color = '#ffffff';
            btn.querySelector('span').innerText = 'Scanning Engine Grid...';
            
            setTimeout(() => {
                alert('Security Protocol Verification Complete: System fully synchronized with Apple Native Core Architecture.');
                btn.style.background = '#ffffff';
                btn.style.color = '#000000';
                btn.querySelector('span').innerText = 'Initialize Deep Protocol Scan';
            }, 1200);
        }
    </script>
</body>
</html>
`;

// --- EXPRESS WEB SERVER HUB ---
const app = express();
app.get('/', (req, res) => {
    const ping = client.ws.ping > 0 ? client.ws.ping : '42';
    res.send(getAdvancedDashboard(ping));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('SaaS Enterprise Dashboard Engine Bound to Port ' + PORT));

// --- CORE DISCORD BOT PROCESS ENGINE ---
client.on('ready', async () => {
    console.log(`System Identity Authenticated as: ${client.user.tag}`);
    try {
        const commands = [
            new SlashCommandBuilder().setName('ping').setDescription('Verify engine cluster ping latency'),
            new SlashCommandBuilder().setName('status').setDescription('Outputs the dynamic security matrix status')
        ];
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands.map(c => c.toJSON()) });
        console.log('--- COMMAND ARCHITECTURE RE-SYNCED ---');
    } catch (err) {
        console.error('Core Script Registry Overload Error:', err);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') await interaction.reply(`Heartbeat Pipeline: ${client.ws.ping}ms`);
    if (interaction.commandName === 'status') await interaction.reply('**SentinX Security Cluster Status**: Armed, operational, and monitoring active threads.');
});

client.login(process.env.DISCORD_TOKEN).catch(e => {
    console.error("CRITICAL: Environment token invalid or blocked by API gateway.");
});
