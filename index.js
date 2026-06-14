const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, ActivityType } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const createEmbed = (title, desc, color) => {
    return new EmbedBuilder().setTitle(title).setDescription(desc).setColor(color).setFooter({ text: 'SentinX Node v1.0' });
};

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Latency'),
    new SlashCommandBuilder().setName('status').setDescription('Health'),
    new SlashCommandBuilder().setName('setstatus').setDescription('Owner only').addStringOption(o => o.setName('text').setDescription('text').setRequired(true))
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Bot is online!');
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    if (i.commandName === 'setstatus') {
        if (i.user.id !== config.ownerId) return i.reply({ content: 'Denied', ephemeral: true });
        client.user.setActivity(i.options.getString('text'), { type: ActivityType.Playing });
        i.reply({ embeds: [createEmbed('Success', 'Status updated', '#00C853')] });
    }
    if (i.commandName === 'ping') i.reply({ embeds: [createEmbed('Ping', `${client.ws.ping}ms`, '#00C853')] });
    if (i.commandName === 'status') i.reply({ embeds: [createEmbed('Status', 'Operational', '#FFD600')] });
});

client.login(process.env.DISCORD_TOKEN);
