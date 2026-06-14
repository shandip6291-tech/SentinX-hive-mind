const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const http = require('http');
require('dotenv').config();

// --- RENDER DUMMY SERVER (SERVER KO LIVE RAKHNE KE LIYE) ---
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('SentinX is online and guarding the server!');
    res.end();
}).listen(process.env.PORT || 3000, () => {
    console.log('Dummy web server is running on port 3000');
});
// ------------------------------------------------------------

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Commands Setup
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check SentinX heartbeat'),
    new SlashCommandBuilder().setName('status').setDescription('Check SentinX operational status'),
    new SlashCommandBuilder().setName('honeypot-setup').setDescription('Initialize Honeypot trap')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Register slash commands
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Successfully registered slash commands.');
    } catch (error) { console.error('Error registering commands:', error); }
})();

// Command Handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') await interaction.reply('SentinX is active! 🚀');
    if (interaction.commandName === 'status') await interaction.reply('System Status: All protocols operational. Apex Predator mode active.');
    if (interaction.commandName === 'honeypot-setup') await interaction.reply('Honeypot trap initialized. Watching for intruders...');
});

// Message Handler
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === 'warning-trigger') {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('SentinX | Diplomatic Warning')
            .setDescription('Please refrain from inappropriate activity. This is your only warning.');
        message.channel.send({ embeds: [embed] });
    }
});

client.once('ready', () => {
    console.log(`SentinX [Apex Predator] is live: ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
