const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check latency'),
    new SlashCommandBuilder().setName('status').setDescription('System health'),
    new SlashCommandBuilder().setName('help').setDescription('View command directory'),
    new SlashCommandBuilder().setName('server').setDescription('Server info'),
    new SlashCommandBuilder().setName('userinfo').setDescription('User data'),
    new SlashCommandBuilder().setName('botinfo').setDescription('SentinX specs'),
    new SlashCommandBuilder().setName('avatar').setDescription('Get avatar'),
    new SlashCommandBuilder().setName('uptime').setDescription('Bot longevity'),
    new SlashCommandBuilder().setName('lock').setDescription('Lock channel'),
    new SlashCommandBuilder().setName('unlock').setDescription('Unlock channel'),
    new SlashCommandBuilder().setName('ban').setDescription('Ban user'),
    new SlashCommandBuilder().setName('kick').setDescription('Kick user'),
    new SlashCommandBuilder().setName('clear').setDescription('Purge logs'),
    new SlashCommandBuilder().setName('report').setDescription('Submit threat'),
    new SlashCommandBuilder().setName('support').setDescription('Get help')
].map(command => command.toJSON());

client.on('ready', async () => {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Commands successfully deployed.');
    } catch (error) { console.error(error); }
    console.log(`🚀 SentinX Online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const embed = new EmbedBuilder()
        .setColor('#FF3B30')
        .setTitle(`Protocol: ${interaction.commandName.toUpperCase()}`)
        .setDescription(`Executing ${interaction.commandName} sequence...`)
        .setFooter({ text: 'SentinX Legal Core | Authorized Access Only' })
        .setTimestamp();

    try {
        if (interaction.commandName === 'ping') {
            embed.setDescription(`Gateway Latency: ${client.ws.ping}ms`);
            await interaction.reply({ embeds: [embed] });
        } else if (interaction.commandName === 'status') {
            embed.setDescription('System Status: **OPERATIONAL & SECURE**');
            await interaction.reply({ embeds: [embed] });
        } else {
            embed.setDescription('Command execution successful.');
            await interaction.reply({ embeds: [embed] });
        }
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'Error in execution.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
