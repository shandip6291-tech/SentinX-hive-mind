const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// --- APPLE UI DASHBOARD (HTML + CSS) ---
const getDashboardHTML = (ping, uptime) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SentinX | Dashboard</title>
    <style>
        :root { --bg: #f5f5f7; --text: #1d1d1f; --card: rgba(255, 255, 255, 0.6); }
        @media (prefers-color-scheme: dark) {
            :root { --bg: #000000; --text: #f5f5f7; --card: rgba(28, 28, 30, 0.6); }
        }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg); color: var(--text);
            display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;
            background-image: radial-gradient(circle at top right, rgba(255,59,48,0.1), transparent 40%),
                              radial-gradient(circle at bottom left, rgba(0,122,255,0.1), transparent 40%);
        }
        .container {
            background: var(--card); 
            backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px);
            border-radius: 24px; padding: 40px; text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 90%; max-width: 400px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        h1 { font-weight: 600; letter-spacing: -0.5px; margin-bottom: 5px; font-size: 28px; }
        p { color: #86868b; margin-bottom: 30px; font-size: 15px; }
        .stats { display: flex; justify-content: space-between; margin-bottom: 20px; gap: 15px; }
        .stat-box { 
            background: rgba(134, 134, 139, 0.1); padding: 20px 15px; 
            border-radius: 20px; flex: 1; 
        }
        .stat-value { font-size: 24px; font-weight: 700; margin-bottom: 5px;}
        .stat-label { font-size: 11px; color: #86868b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;}
        .status-dot { height: 10px; width: 10px; background-color: #34c759; border-radius: 50%; display: inline-block; margin-right: 8px; box-shadow: 0 0 8px #34c759; }
        .btn {
            background: #007aff; color: white; border: none; padding: 14px 24px;
            border-radius: 100px; font-size: 15px; font-weight: 600; cursor: pointer;
            transition: all 0.2s ease; width: 100%; margin-top: 10px;
        }
        .btn:hover { background: #0066d6; transform: scale(0.98); }
    </style>
</head>
<body>
    <div class="container">
        <h1>SentinX Intelligence</h1>
        <p><span class="status-dot"></span>Apex Predator Online</p>
        
        <div class="stats">
            <div class="stat-box">
                <div class="stat-value">SECURE</div>
                <div class="stat-label">Network Status</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${ping}ms</div>
                <div class="stat-label">Bot Latency</div>
            </div>
        </div>
        
        <button class="btn" onclick="alert('SentinX Dashboard Mode Active. Full controls are managed via Discord.')">System Details</button>
    </div>
</body>
</html>
`;

// --- EXPRESS WEB SERVER ---
const app = express();
app.get('/', (req, res) => {
    // Injecting live ping into the Apple UI HTML
    const ping = client.ws.ping || 0;
    res.send(getDashboardHTML(ping, client.uptime));
});
app.listen(process.env.PORT || 3000, () => console.log('Web Dashboard Live'));


// --- DISCORD BOT LOGIC ---
client.on('ready', async () => {
    const commands = [
        new SlashCommandBuilder().setName('ping').setDescription('Check latency'),
        new SlashCommandBuilder().setName('status').setDescription('Bot status'),
        new SlashCommandBuilder().setName('setprefix').setDescription('Change prefix').addStringOption(o => o.setName('p').setDescription('New prefix').setRequired(true))
    ];
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands.map(c => c.toJSON()) });
    console.log('Bot & Commands Online.');
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    if (i.commandName === 'ping') await i.reply(`Heartbeat: ${client.ws.ping}ms`);
    if (i.commandName === 'status') await i.reply('SentinX is Operational.');
    if (i.commandName === 'setprefix') await i.reply('Prefix updated.');
});

client.login(process.env.DISCORD_TOKEN);
