const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');
require('dotenv').config();

// Port Binding (Fix for Render)
const app = express();
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Commands register karne ka command (Force Update)
client.on('ready', async () => {
    const commands = [
        new SlashCommandBuilder().setName('ping').setDescription('Check latency'),
        new SlashCommandBuilder().setName('status').setDescription('Bot status'),
        new SlashCommandBuilder().setName('setprefix').setDescription('Change prefix').addStringOption(o => o.setName('p').setDescription('New prefix').setRequired(true))
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands.map(c => c.toJSON()) });
    console.log('--- COMMANDS SYNCED ---');
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    if (i.commandName === 'ping') await i.reply(`Heartbeat: ${client.ws.ping}ms`);
    if (i.commandName === 'status') await i.reply('SentinX is Operational.');
    if (i.commandName === 'setprefix') await i.reply('Prefix updated.');
});

client.login(process.env.DISCORD_TOKEN);
