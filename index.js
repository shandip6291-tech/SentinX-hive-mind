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

// --- APEX PREMIUM DASHBOARD ---
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SentinX | Apex Predator</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body {
            background-color: #050505; color: #ffffff;
            background-image: radial-gradient(circle at 70% 30%, rgba(255, 0, 51, 0.15), transparent 50%),
                              radial-gradient(circle at 20% 80%, rgba(200, 0, 0, 0.05), transparent 40%);
            min-height: 100vh; padding: 2rem; display: flex; flex-direction: column;
        }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 3rem; }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; }
        .logo span { color: #ff0033; }
        .status-badge { background: rgba(255, 0, 51, 0.1); color: #ff0033; padding: 5px 15px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; border: 1px solid rgba(255, 0, 51, 0.3); }
        .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-bottom: 4rem; flex: 1; }
        .hero-text h1 { font-size: 4.5rem; font-weight: 900; line-height: 1.1; letter-spacing: -2px; margin-bottom: 1.5rem; }
        .hero-text h1 .highlight { color: #ff0033; display: block; }
        .hero-text p { color: #888; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; }
        .btn { background: #ff0033; color: white; border: none; padding: 15px 30px; border-radius: 50px; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 0 20px rgba(255, 0, 51, 0.4); }
        .btn:hover { background: #cc0029; box-shadow: 0 0 30px rgba(255, 0, 51, 0.6); }
        .hero-visual { position: relative; width: 100%; height: 350px; background: rgba(15, 15, 15, 0.6); border-radius: 30px; border: 1px solid rgba(255, 50, 50, 0.1); display: flex; justify-content: center; align-items: center; overflow: hidden; }
        .hero-visual::before { content: ''; position: absolute; width: 150px; height: 150px; background: #ff0033; filter: blur(80px); border-radius: 50%; opacity: 0.5; }
        .bento-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-top: auto; }
        .card { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: 24px; }
        .card-title { font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
        .card-value { font-size: 2.5rem; font-weight: 900; color: #fff; }
        .card-value.red { color: #ff0033; }
        @media (max-width: 768px) { .hero { grid-template-columns: 1fr; gap: 2rem; } .hero-text h1 { font-size: 3rem; } }
    </style>
</head>
<body>
    <div class="navbar">
        <div class="logo">SentinX <span>AI</span></div>
        <div class="status-badge">● SYSTEM ARMED</div>
    </div>
    <div class="hero">
        <div class="hero-text">
            <h1>Your AI <span class="highlight">Predator Team</span> On Demand</h1>
            <p>Automated security protocols running with maximum lethal intelligence. SentinX protects your server with zero friction.</p>
            <button class="btn" onclick="alert('SentinX Dashboard Operational.')">System Core</button>
        </div>
        <div class="hero-visual">
            <h2 style="color: rgba(255,255,255,0.8); font-weight: 300; letter-spacing: 5px;">CORE ACTIVE</h2>
        </div>
    </div>
    <div class="bento-grid">
        <div class="card"><div class="card-title">System Status</div><div class="card-value red">ONLINE</div></div>
        <div class="card"><div class="card-title">Success Rate</div><div class="card-value">99.9%</div></div>
        <div class="card"><div class="card-title">Security Core</div><div class="card-value">APEX</div></div>
    </div>
</body>
</html>
`;

// --- EXPRESS WEB SERVER ---
const app = express();
app.get('/', (req, res) => {
    res.send(htmlContent);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Dashboard Web Server running on port ${PORT}`);
});

// --- DISCORD BOT LOGIC ---
client.on('ready', async () => {
    console.log(`${client.user.tag} Is Fully Operational!`);
    try {
        const commands = [
            new SlashCommandBuilder().setName('ping').setDescription('Check bot latency'),
            new SlashCommandBuilder().setName('status').setDescription('Get system status')
        ];
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), 
            { body: commands.map(c => c.toJSON()) }
        );
        console.log('Slash commands registered successfully.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') {
        await interaction.reply(`Heartbeat: ${client.ws.ping}ms`);
    }
    if (interaction.commandName === 'status') {
        await interaction.reply('SentinX Status: Operational and Armed.');
    }
});

// Catch login errors to prevent silent crashes
client.login(process.env.DISCORD_TOKEN).catch(err => {
    console.error("CRITICAL LOGIN ERROR: Check if DISCORD_TOKEN is correct in Render Environment Variables!");
    console.error(err);
});
