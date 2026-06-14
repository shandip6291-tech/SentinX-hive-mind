const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// KILLING MACHINE EMBED
const killEmbed = (title, desc) => new EmbedBuilder()
    .setTitle(`>> TERMINATION: ${title}`)
    .setDescription(`[SYSTEM]: ${desc}\n\nStatus: **ELIMINATED**`)
    .setColor('#FF0000')
    .setTimestamp()
    .setFooter({ text: 'SentinX | Apex Predator | Killing Machine Mode' });

const commands = [
    { name: 'ping', desc: 'Check latency' }, { name: 'status', desc: 'System health' },
    { name: 'help', desc: 'List commands' }, { name: 'ban', desc: 'Ban user' },
    { name: 'kick', desc: 'Kick user' }, { name: 'clear', desc: 'Purge messages' },
    { name: 'lock', desc: 'Lock channel' }, { name: 'unlock', desc: 'Unlock channel' },
    { name: 'nuke', desc: 'Nuke channel' }, { name: 'warn', desc: 'Warn user' },
    { name: 'setprefix', desc: 'Change prefix' }, { name: 'setstatus', desc: 'Change status' },
    { name: 'hive-mind', desc: 'Sync nodes' }, { name: 'anti-raid', desc: 'Toggle high security' },
    { name: 'kill-mode', desc: 'Activate aggressive defense' }
].map(c => new SlashCommandBuilder().setName(c.name).setDescription(c.desc).toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('SentinX Killing Machine Online.');
});

// HIVE-MIND RAID PROTECTION
client.on('guildMemberAdd', async member => {
    if (config.killModeActive) {
        await member.ban({ reason: 'Apex Predator: Kill-Mode Active' });
    }
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    
    // KILL MODE LOGIC
    if (i.commandName === 'kill-mode') {
        config.killModeActive = true;
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
        i.reply({ embeds: [killEmbed('KILL-MODE ACTIVATED', 'All unauthorized connections will be terminated instantly.')] });
    }

    // COMMANDS LOGIC
    if (i.commandName === 'ping') i.reply(`Heartbeat: ${client.ws.ping}ms`);
    if (i.commandName === 'status') i.reply({ embeds: [killEmbed('SYSTEM STATUS', 'Operational & Lethal')] });
    if (i.commandName === 'help') i.reply('Commands: Ping, Status, Ban, Kick, Clear, Lock, Unlock, Nuke, Warn, Setprefix, Setstatus, Hive-mind, Anti-raid, Kill-mode');
    
    // Add logic for others like ban/kick/etc...
});

client.login(process.env.DISCORD_TOKEN);
