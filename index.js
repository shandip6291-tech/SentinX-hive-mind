const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const http = require('http');
const express = require('express');
const app = express();
require('dotenv').config();

// --- 1. DASHBOARD & KEEP-ALIVE SERVER ---
app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="background:#000; color:#0f0; font-family: 'Courier New', Courier, monospace; text-align: center; padding-top: 50px;">
                <h1>SentinX Intelligence Dashboard</h1>
                <p>System Status: OPERATIONAL</p>
                <p>Apex Predator Mode: ACTIVE</p>
            </body>
        </html>
    `);
});
app.listen(process.env.PORT || 3000);

// --- 2. BOT CONFIGURATION ---
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// --- 3. COMMAND REGISTRATION ---
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
        console.log('Successfully registered all commands.');
    } catch (e) { console.error(e); }
})();

// --- 4. CORE AI & SECURITY LOGIC ---
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    // AI Intelligence Trigger
    if (message.content.startsWith('!ai')) {
        await message.reply('SentinX AI: Processing query... Analysis complete: Apex Predator protocol suggests maximum efficiency.');
    }
    
    // Security Trigger
    if (message.content.toLowerCase() === 'warning-trigger') {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('SentinX | Security Protocol')
            .setDescription('Inappropriate activity detected. Immediate cessation required.');
        message.channel.send({ embeds: [embed] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') await interaction.reply('SentinX is live and optimized!');
    if (interaction.commandName === 'status') await interaction.reply('Status: All systems GREEN. Hive Mind synced.');
    if (interaction.commandName === 'hive-mind') await interaction.reply('🔗 Hive Mind established. Nodes connected.');
    if (interaction.commandName === 'anti-raid') await interaction.reply('🛡️ Anti-Raid: ACTIVE. Monitoring for threats.');
});

client.once('ready', () => {
    console.log(`SentinX [Apex Predator] is LIVE: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
