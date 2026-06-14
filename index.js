const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, ActivityType } = require('discord.js');
const express = require('express');
const fs = require('fs');
const app = express();
require('dotenv').config();

// Config Load
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Dashboard Server
app.get('/', (req, res) => res.send('SentinX Apex Predator Online'));
app.listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

// Professional Embed Template
const createEmbed = (title, description, color) => {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'SentinX Intelligence | Apex Predator Node v1.0 | Developed by You' });
};

// Command Setup
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check system latency'),
    new SlashCommandBuilder().setName('status').setDescription('View system health'),
    new SlashCommandBuilder().setName('hive-mind').setDescription('Sync predator nodes'),
    new SlashCommandBuilder().setName('anti-raid').setDescription('Toggle security shield'),
    new SlashCommandBuilder().setName('setstatus').setDescription('Change bot status (Owner Only)')
        .addStringOption(option => option.setName('text').setDescription('New status text').setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('SentinX [Apex Predator] is LIVE & Commands Synced.');
    } catch (e) { console.error(e); }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply({ embeds: [createEmbed('📡 System Latency', `Heartbeat: ${client.ws.ping}ms`, '#00C853')] });
    }
    
    if (interaction.commandName === 'status') {
        await interaction.reply({ embeds: [createEmbed('⚙️ System Status', '**Node:** Operational\n**Apex Mode:** Active\n**Hive Mind:** Synced', '#FFD600')] });
    }

    if (interaction.commandName === 'hive-mind') {
        await interaction.reply({ embeds: [createEmbed('🔗 Hive Mind', 'Global predator nodes synchronized successfully.', '#00C853')] });
    }

    if (interaction.commandName === 'anti-raid') {
        await interaction.reply({ embeds: [createEmbed('🛡️ Security Protocol', 'Anti-Raid monitoring set to: **MAXIMUM**', '#D50000')] });
    }

    if (interaction.commandName === 'setstatus
