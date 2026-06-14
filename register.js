const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Latency check'),
    new SlashCommandBuilder().setName('userinfo').setDescription('Scan user').addUserOption(o=>o.setName('target').setDescription('User')),
    new SlashCommandBuilder().setName('ban').setDescription('Ban user').addUserOption(o=>o.setName('target').setDescription('User').setRequired(true))
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
    .then(() => console.log('✅ Commands Locked.'))
    .catch(console.error);
