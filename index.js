const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');
const fs = require('fs');
const express = require('express');
require('dotenv').config();

// Express server for Render port binding
const app = express();
app.get('/', (req, res) => res.send('SentinX Apex Predator Online'));
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Killing Machine Embed Template
const killEmbed = (title, desc) => new EmbedBuilder()
    .setTitle(`>> TERMINATION: ${title}`)
    .setDescription(`[SYSTEM]: ${desc}\n\nStatus: **ELIMINATED**`)
    .setColor('#FF0000')
    .setTimestamp()
    .setFooter({ text: 'SentinX | Apex Predator | Killing Machine Mode' });

// 15+ Slash Commands Setup
const commands = [
    { name: 'ping', desc: 'Latency' }, { name: 'status', desc: 'System' },
    { name: 'ban', desc: 'Ban target' }, { name: 'kick', desc: 'Kick target' },
    { name: 'clear', desc: 'Purge' }, { name: 'lock', desc: 'Lock server' },
    { name: 'unlock', desc: 'Unlock server' }, { name: 'nuke', desc: 'Nuke channel' },
    { name: 'help', desc: 'Commands' }, { name: 'setprefix', desc: 'Set prefix' },
    { name: 'setstatus', desc: 'Set activity' }, { name: 'hive-mind', desc: 'Sync nodes' },
    { name: 'anti-raid', desc: 'Toggle high security' }, { name: 'warn', desc: 'Warning' },
    { name: 'kill-mode', desc: 'Activate aggressive defense' }
].map(c => new SlashCommandBuilder().setName(c.name).setDescription(c.desc).toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('SentinX Killing Machine Online & Armed.');
});

// Anti-Raid / Kill-Mode Trigger
client.on('guildMemberAdd', async member => {
    if (config.killModeActive) {
        await member.ban({ reason: 'Apex Predator: Kill-Mode Active' });
    }
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    
    // Auth Check: Owner or Admin
    const auth = i.user.id === config.ownerId || i.member.permissions.has(PermissionFlagsBits.Administrator);

    if (i.commandName === 'kill-mode') {
        if(!auth) return i.reply('❌ Denied');
        config.killModeActive = true;
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
        i.reply({ embeds: [killEmbed('KILL-MODE ACTIVATED', 'All unauthorized connections will be terminated instantly.')] });
    }

    if (i.commandName === 'ping') i.reply(`Heartbeat: ${client.ws.ping}ms`);
    if (i.commandName === 'status') i.reply({ embeds: [killEmbed('SYSTEM STATUS', 'Operational & Lethal')] });
    if (i.commandName === 'help') i.reply('Commands: Ping, Status, Ban, Kick, Clear, Lock, Unlock, Nuke, Warn, Setprefix, Setstatus, Hive-mind, Anti-raid, Kill-mode');
});

client.login(process.env.DISCORD_TOKEN);
