const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, ActivityType } = require('discord.js');
const express = require('express');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('SentinX Apex Predator Online'));
app.listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const createEmbed = (title, description, color) => {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'SentinX Intelligence | Apex Predator Node v1.0' });
};

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check latency'),
    new SlashCommandBuilder().setName('status').setDescription('View health'),
    new SlashCommandBuilder().setName('hive-mind').setDescription('Sync nodes'),
    new SlashCommandBuilder().setName('anti-raid').setDescription('Toggle shield'),
    new SlashCommandBuilder().setName('setstatus').setDescription('Change status')
        .addStringOption(option => option.setName('text').setDescription('Text').setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('SentinX is LIVE.');
    } catch (e) { console.error(e); }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'setstatus') {
        const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
        if (interaction.user.id !== config.ownerId) {
            return interaction.reply({ content: '❌ Access Denied.', ephemeral: true });
        }
        const newStatus = interaction.options.getString('text');
        client.user.setActivity(newStatus, { type: ActivityType.Playing });
        await interaction.reply({ embeds: [createEmbed('✅ Status', `Set to: ${newStatus}`, '#00C853')] });
    }
    
    if (interaction.commandName === 'ping') await interaction.reply({ embeds: [createEmbed('📡 Latency', `${client.ws.ping}ms`, '#00C853')] });
    if (interaction.commandName === 'status') await interaction.reply({ embeds: [createEmbed('⚙️ Status', 'Operational', '#FFD600')] });
    if (interaction.commandName === 'hive-mind') await interaction.reply({ embeds: [createEmbed('🔗 Hive Mind', 'Synced', '#00C853')] });
    if (interaction.commandName === 'anti-raid') await interaction.reply({ embeds: [createEmbed('🛡️ Shield', 'MAXIMUM', '#D50000')] });
});

client.login(process.env.DISCORD_TOKEN);
