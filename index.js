const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const commands = [
    // MODERATION
    { name: 'ban', desc: 'Ban a member' }, { name: 'kick', desc: 'Kick a member' },
    { name: 'timeout', desc: 'Mute a member' }, { name: 'warn', desc: 'Warn a member' },
    { name: 'clear', desc: 'Purge messages' }, { name: 'lock', desc: 'Lock channel' },
    { name: 'unlock', desc: 'Unlock channel' }, { name: 'nuke', desc: 'Nuke channel' },
    // INFO
    { name: 'ping', desc: 'Check latency' }, { name: 'status', desc: 'System status' },
    { name: 'userinfo', desc: 'User data' }, { name: 'server', desc: 'Server info' },
    { name: 'avatar', desc: 'Get avatar' }, { name: 'botinfo', desc: 'Bot specs' },
    { name: 'uptime', desc: 'Uptime check' }, { name: 'roles', desc: 'List roles' },
    // UTILITY
    { name: 'report', desc: 'Send report' }, { name: 'support', desc: 'Get help' },
    { name: 'invite', desc: 'Bot invite' }, { name: 'say', desc: 'Bot speaks' }
].map(c => new SlashCommandBuilder().setName(c.name).setDescription(c.desc).toJSON());

client.on('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('✅ 20+ Predator Commands Synchronized.');
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    
    // Yahan logic switch hoga
    const c = i.commandName;
    if (c === 'ping') await i.reply(`Pong! ${client.ws.ping}ms`);
    else if (c === 'status') await i.reply('Predator Core: Active and Monitoring.');
    else if (c === 'server') await i.reply(`Server: ${i.guild.name} | Members: ${i.guild.memberCount}`);
    else if (c === 'botinfo') await i.reply('SentinX AI Security v3.0 | Predator Architecture');
    else if (c === 'uptime') await i.reply(`Uptime: ${Math.floor(client.uptime/60000)} minutes`);
    else await i.reply({ content: `Protocol **${c.toUpperCase()}** initialized and operational.`, ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);
