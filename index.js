const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const http = require('http');
const express = require('express');
const app = express();
require('dotenv').config();

// --- 1. DASHBOARD & KEEP-ALIVE SERVER (APPLE-STYLE UI FOUNDATION) ---
app.get('/', (req, res) => {
    res.send('<h1>SentinX Intelligence Dashboard</h1><p>System Status: Online</p><style>body{background:#000;color:#fff;font-family:sans-serif;}</style>');
});
app.listen(process.env.PORT || 3000);

// --- 2. BOT SETUP ---
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

// --- 3. COMMANDS ---
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check SentinX heartbeat'),
    new SlashCommandBuilder().setName('status').setDescription('System health check'),
    new SlashCommandBuilder().setName('hive-mind').setDescription('Sync SentinX nodes'),
    new SlashCommandBuilder().setName('anti-raid').setDescription('Toggle security')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    } catch (e) { console.error(e); }
})();

// --- 4. AI SUPER INTELLIGENCE (SIMULATED BRAIN) ---
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    // Yahan tera AI logic activate hoga
    if (message.content.startsWith('!ai')) {
        await message.reply('SentinX AI: Analysis complete. Processing your query with Apex intelligence...');
    }
    
    // Security Trigger
    if (message.content.toLowerCase() === 'warning-trigger') {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('SentinX | Threat Detected')
            .setDescription('Security protocol active. Neutralizing...');
        message.channel.send({ embeds: [embed] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') await interaction.reply('SentinX is live and optimized!');
    if (interaction.commandName === 'status') await interaction.reply('Status: Apex Predator level intelligence operational.');
});

client.once('ready', () => {
    console.log(`SentinX [Apex Predator] is LIVE: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
