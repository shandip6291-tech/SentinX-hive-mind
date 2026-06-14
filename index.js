const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('SentinX Apex Predator Online'));
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// 1. Slash Commands Definition
const slash = [
    { name: 'ping', desc: 'Latency' },
    { name: 'status', desc: 'System' },
    { name: 'setprefix', desc: 'Change prefix' }
].map(c => new SlashCommandBuilder().setName(c.name).setDescription(c.desc).toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: slash });
    console.log('SentinX Online & Synced.');
});

// 2. Interaction Handler (Slash)
client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const embed = new EmbedBuilder().setColor('#FF0000').setTimestamp();

    if (i.commandName === 'ping') await i.reply(`Heartbeat: ${client.ws.ping}ms`);
    if (i.commandName === 'status') {
        embed.setTitle('SentinX System').setDescription('Apex Predator Node: **OPERATIONAL**');
        await i.reply({ embeds: [embed] });
    }
});

// 3. Message Handler (Prefix: •)
client.on('messageCreate', async msg => {
    if (!msg.content.startsWith(config.defaultPrefix) || msg.author.bot) return;
    const args = msg.content.slice(config.defaultPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'status') {
        const embed = new EmbedBuilder().setColor('#FF0000').setTitle('System Status').setDescription('Apex Predator Node | Operational');
        msg.reply({ embeds: [embed] });
    }
    if (command === 'ping') msg.reply(`Heartbeat: ${client.ws.ping}ms`);
});

client.login(process.env.DISCORD_TOKEN);
