const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('SentinX Apex Predator - Online'));
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Command Definition
const slashCommands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check latency'),
    new SlashCommandBuilder().setName('status').setDescription('System health'),
    new SlashCommandBuilder().setName('setprefix')
        .setDescription('Change bot prefix')
        .addStringOption(option => option.setName('new').setDescription('Enter new prefix').setRequired(true))
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: slashCommands.map(c => c.toJSON()) });
    console.log('SentinX: Apex Predator Node Online.');
});

// Slash Command Handler
client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;

    if (i.commandName === 'setprefix') {
        if (!i.member.permissions.has(PermissionFlagsBits.Administrator)) return i.reply('❌ Admin Only.');
        const newPrefix = i.options.getString('new');
        config.defaultPrefix = newPrefix;
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
        i.reply(`✅ Prefix updated to: \`${newPrefix}\``);
    }
    if (i.commandName === 'ping') i.reply(`Heartbeat: ${client.ws.ping}ms`);
});

// Prefix Command Handler (e.g., •ping)
client.on('messageCreate', async message => {
    if (!message.content.startsWith(config.defaultPrefix) || message.author.bot) return;

    const args = message.content.slice(config.defaultPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') message.reply(`Pong! Current Prefix: ${config.defaultPrefix}`);
});

client.login(process.env.DISCORD_TOKEN);
