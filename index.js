const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

// Commands definition
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check SentinX heartbeat'),
    new SlashCommandBuilder().setName('status').setDescription('Check SentinX operational status'),
    new SlashCommandBuilder().setName('honeypot-setup').setDescription('Initialize Honeypot trap')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Register commands
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Successfully registered slash commands.');
    } catch (error) { console.error(error); }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') await interaction.reply('SentinX is active! 🚀');
    if (interaction.commandName === 'status') await interaction.reply('System Status: All protocols operational. Apex Predator mode active.');
    if (interaction.commandName === 'honeypot-setup') await interaction.reply('Honeypot trap initialized. Watching for intruders...');
});

client.login(process.env.DISCORD_TOKEN);
