const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');
const fs = require('fs');
require('dotenv').config();

// Port Binding Fix
const app = express();
app.get('/', (req, res) => res.send('SentinX Predator Node Online'));
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Commands
const commands = [
    { name: 'ping', description: 'Check latency' },
    { name: 'status', description: 'System status' },
    { name: 'help', description: 'Command list' }
].map(cmd => new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.description).toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('SentinX Active.');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply(`Latency: ${client.ws.ping}ms`);
    } else if (interaction.commandName === 'status') {
        await interaction.reply({ embeds: [new EmbedBuilder().setTitle('System').setDescription('Operational').setColor('#FF0000')] });
    } else if (interaction.commandName === 'help') {
        await interaction.reply('Available: /ping, /status, /help');
    }
});

client.login(process.env.DISCORD_TOKEN);
