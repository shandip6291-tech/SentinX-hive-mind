const { SlashCommandBuilder } = require('discord.js');

module.exports = [
    { data: new SlashCommandBuilder().setName('ping').setDescription('Bot latency check'), premium: false },
    { data: new SlashCommandBuilder().setName('status').setDescription('System health metrics'), premium: false },
    { data: new SlashCommandBuilder().setName('userinfo').setDescription('View user profile data'), premium: false },
    { data: new SlashCommandBuilder().setName('server').setDescription('Display server analytics'), premium: false },
    { data: new SlashCommandBuilder().setName('clear').setDescription('Purge messages [Admin]'), premium: true },
    { data: new SlashCommandBuilder().setName('ban').setDescription('Restrict user access [Admin]'), premium: true },
    { data: new SlashCommandBuilder().setName('kick').setDescription('Remove member [Admin]'), premium: true },
    { data: new SlashCommandBuilder().setName('lockdown').setDescription('Secure channel perimeter [Premium]'), premium: true },
    { data: new SlashCommandBuilder().setName('report').setDescription('Submit threat logs'), premium: false },
    { data: new SlashCommandBuilder().setName('help').setDescription('View command directory'), premium: false },
    { data: new SlashCommandBuilder().setName('botinfo').setDescription('SentinX core specs'), premium: false },
    { data: new SlashCommandBuilder().setName('avatar').setDescription('Display member avatar'), premium: false },
    { data: new SlashCommandBuilder().setName('mute').setDescription('Silence unruly nodes [Mod]'), premium: true },
    { data: new SlashCommandBuilder().setName('unmute').setDescription('Restore audio channels'), premium: true },
    { data: new SlashCommandBuilder().setName('uptime').setDescription('Bot operational duration'), premium: false }
];
