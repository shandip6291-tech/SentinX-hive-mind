const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]
});
const app = express();
app.get('/', (req, res) => {
const ping = client.ws.ping > 0 ? client.ws.ping : '24';
try {
let html = fs.readFileSync(path.join(__dirname, 'dashboard.html'), 'utf8');
html = html.replace('BOT_PING_PLACEHOLDER', ping);
res.send(html);
} catch (err) {
res.send('Dashboard HTML loading error.');
}
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
client.on('ready', async () => {
console.log(Bot Active: ${client.user.tag});
try {
const commands = [
new SlashCommandBuilder().setName('ping').setDescription('Verify ping latency'),
new SlashCommandBuilder().setName('status').setDescription('Outputs security status')
];
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands.map(c => c.toJSON()) });
} catch (err) { console.error(err); }
});
client.on('interactionCreate', async interaction => {
if (!interaction.isChatInputCommand()) return;
if (interaction.commandName === 'ping') await interaction.reply(Heartbeat: ${client.ws.ping}ms);
if (interaction.commandName === 'status') await interaction.reply('SentinX Secure Core Lock: Active.');
});
client.login(process.env.DISCORD_TOKEN).catch(() => console.error("Login failed."));