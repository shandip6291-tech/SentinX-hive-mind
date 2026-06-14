const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, REST, Routes, SlashCommandBuilder, MessageFlags } = require('discord.js');
const http = require('http');

// Render Port Binder
http.createServer((req, res) => res.end('Hive Mind Neural Network: ONLINE')).listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// ==========================================
// 🧠 HIVE MIND UI GENERATOR (Tagda UI)
// ==========================================
const HiveEmbed = (title, desc, color = '#00FF99') => {
    return new EmbedBuilder()
        .setTitle(`🧠 HIVE MIND: ${title}`)
        .setDescription(desc)
        .setColor(color)
        .setFooter({ text: 'Neural Network Collective • SentinX' })
        .setTimestamp();
};

const ErrorEmbed = (msg) => HiveEmbed('ACCESS DENIED', `❌ ${msg}`, '#FF0000');

// ==========================================
// 🚀 30 COMMANDS REGISTRY
// ==========================================
const commandsData = [
    // --- CORE INFO (6) ---
    new SlashCommandBuilder().setName('ping').setDescription('Check Neural Network Latency'),
    new SlashCommandBuilder().setName('uptime').setDescription('Check Hive Core uptime'),
    new SlashCommandBuilder().setName('botinfo').setDescription('View AI specifications'),
    new SlashCommandBuilder().setName('serverinfo').setDescription('Scan server data'),
    new SlashCommandBuilder().setName('userinfo').setDescription('Scan user data').addUserOption(o => o.setName('target').setDescription('User')),
    new SlashCommandBuilder().setName('avatar').setDescription('Extract user avatar').addUserOption(o => o.setName('target').setDescription('User')),
    
    // --- MODERATION (6) ---
    new SlashCommandBuilder().setName('ban').setDescription('Eradicate a threat').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('kick').setDescription('Eject a user').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('timeout').setDescription('Isolate a user').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)).addIntegerOption(o => o.setName('minutes').setDescription('Duration').setRequired(true)),
    new SlashCommandBuilder().setName('untimeout').setDescription('Restore user access').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('clear').setDescription('Purge data logs (messages)').addIntegerOption(o => o.setName('amount').setDescription('Count (1-100)').setRequired(true)),
    new SlashCommandBuilder().setName('nuke').setDescription('Annihilate and recreate channel'),

    // --- SECTOR CONTROL (4) ---
    new SlashCommandBuilder().setName('lock').setDescription('Lock down sector'),
    new SlashCommandBuilder().setName('unlock').setDescription('Release sector lockdown'),
    new SlashCommandBuilder().setName('slowmode').setDescription('Throttle message rate').addIntegerOption(o => o.setName('seconds').setDescription('Delay').setRequired(true)),
    new SlashCommandBuilder().setName('membercount').setDescription('Count assimilated entities'),

    // --- HIVE UTILITIES (5) ---
    new SlashCommandBuilder().setName('say').setDescription('Speak through the Hive Mind').addStringOption(o => o.setName('message').setDescription('Text').setRequired(true)),
    new SlashCommandBuilder().setName('announce').setDescription('Broadcast official message').addStringOption(o => o.setName('text').setDescription('Text').setRequired(true)),
    new SlashCommandBuilder().setName('math').setDescription('Calculate data').addStringOption(o => o.setName('expression').setDescription('E.g. 5+5').setRequired(true)),
    new SlashCommandBuilder().setName('poll').setDescription('Create a collective poll').addStringOption(o => o.setName('question').setDescription('Query').setRequired(true)),
    new SlashCommandBuilder().setName('roles').setDescription('List all server roles'),

    // --- HIVE ASSIMILATION / FUN (5) ---
    new SlashCommandBuilder().setName('hivestatus').setDescription('Check global neural network'),
    new SlashCommandBuilder().setName('assimilate').setDescription('Assimilate a user').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('threatscan').setDescription('Scan user for threats').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('coinflip').setDescription('Quantum probability generator'),
    new SlashCommandBuilder().setName('8ball').setDescription('Query the Hive Core').addStringOption(o => o.setName('question').setDescription('Query').setRequired(true)),

    // --- SECURITY PROTOCOLS (4) ---
    new SlashCommandBuilder().setName('firewall').setDescription('Activate network firewall'),
    new SlashCommandBuilder().setName('breach').setDescription('Simulate a security breach'),
    new SlashCommandBuilder().setName('override').setDescription('Admin protocol override'),
    new SlashCommandBuilder().setName('purge-weak').setDescription('Identify inactive entities')
].map(c => c.toJSON());

// ==========================================
// ⚙️ AUTO-REGISTRATION (Deletes old commands automatically)
// ==========================================
client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        console.log('🔄 Overwriting old commands with Hive Mind Protocols...');
        await rest.put(Routes.applicationCommands(client.user.id), { body: commandsData });
        console.log(`✅ [HIVE MIND] 30 Neural Protocols Deployed. Target: ${client.user.tag}`);
    } catch (e) { console.error(e); }
});

// ==========================================
// ⚡ 30 COMMANDS LOGIC ROUTER
// ==========================================
client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const cmd = i.commandName;

    // Helper for permissions
    const isMod = i.member.permissions.has(PermissionsBitField.Flags.ModerateMembers);
    const isAdmin = i.member.permissions.has(PermissionsBitField.Flags.Administrator);

    try {
        switch (cmd) {
            // --- INFO ---
            case 'ping':
                return i.reply({ embeds: [HiveEmbed('NETWORK LATENCY', `Signal received in **${client.ws.ping}ms**`)] });
            case 'uptime':
                return i.reply({ embeds: [HiveEmbed('SYSTEM UPTIME', `Core active for **${Math.floor(client.uptime / 60000)} minutes**`)] });
            case 'botinfo':
                return i.reply({ embeds: [HiveEmbed('NEURAL ENGINE', `**Name:** SentinX Hive\n**Version:** 5.0.0\n**Protocols:** 30 Active`)] });
            case 'serverinfo':
                return i.reply({ embeds: [HiveEmbed('SECTOR DATA', `**Name:** ${i.guild.name}\n**Entities:** ${i.guild.memberCount}\n**ID:** ${i.guild.id}`)] });
            case 'userinfo':
                const u = i.options.getUser('target') || i.user;
                return i.reply({ embeds: [HiveEmbed('ENTITY SCAN', `**Designation:** ${u.tag}\n**ID:** ${u.id}\n**Bot:** ${u.bot}`)] });
            case 'avatar':
                const avU = i.options.getUser('target') || i.user;
                return i.reply({ embeds: [HiveEmbed('VISUAL DATA', `Target: ${avU.username}`).setImage(avU.displayAvatarURL({ size: 1024 }))] });
            
            // --- MODERATION ---
            case 'ban':
                if (!isAdmin) return i.reply({ embeds: [ErrorEmbed('Admin clearance required.')] });
                const bTarget = i.options.getMember('target');
                if (!bTarget) return i.reply({ embeds: [ErrorEmbed('Entity not found.')] });
                await bTarget.ban();
                return i.reply({ embeds: [HiveEmbed('ERADICATION', `Entity **${bTarget.user.tag}** has been purged from the sector.`)] });
            case 'kick':
                if (!isMod) return i.reply({ embeds: [ErrorEmbed('Mod clearance required.')] });
                const kTarget = i.options.getMember('target');
                if (!kTarget) return i.reply({ embeds: [ErrorEmbed('Entity not found.')] });
                await kTarget.kick();
                return i.reply({ embeds: [HiveEmbed('EJECTION', `Entity **${kTarget.user.tag}** has been removed.`)] });
            case 'timeout':
                if (!isMod) return i.reply({ embeds: [ErrorEmbed('Mod clearance required.')] });
                const tmTarget = i.options.getMember('target');
                const mins = i.options.getInteger('minutes');
                await tmTarget.timeout(mins * 60 * 1000, 'Hive Mind Isolation');
                return i.reply({ embeds: [HiveEmbed('ISOLATION', `Entity **${tmTarget.user.tag}** isolated for ${mins} minutes.`)] });
            case 'untimeout':
                if (!isMod) return i.reply({ embeds: [ErrorEmbed('Mod clearance required.')] });
                const untmTarget = i.options.getMember('target');
                await untmTarget.timeout(null);
                return i.reply({ embeds: [HiveEmbed('RESTORED', `Entity **${untmTarget.user.tag}** isolation lifted.`)] });
            case 'clear':
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return i.reply({ embeds: [ErrorEmbed('Manage Messages clearance required.')] });
                const amt = i.options.getInteger('amount');
                await i.channel.bulkDelete(amt, true);
                return i.reply({ embeds: [HiveEmbed('DATA PURGED', `**${amt}** data logs destroyed.`)], flags: [MessageFlags.Ephemeral] });
            case 'nuke':
                if (!isAdmin) return i.reply({ embeds: [ErrorEmbed('Admin clearance required.')] });
                const pos = i.channel.position;
                const cloned = await i.channel.clone();
                await cloned.setPosition(pos);
                await i.channel.delete();
                return cloned.send({ embeds: [HiveEmbed('SECTOR NUKED', 'Old channel eradicated. Clean slate generated.', '#FF0000').setImage('https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif')] });

            // --- SECTOR CONTROL ---
            case 'lock':
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return i.reply({ embeds: [ErrorEmbed('Clearance required.')] });
                await i.channel.permissionOverwrites.edit(i.guild.roles.everyone, { SendMessages: false });
                return i.reply({ embeds: [HiveEmbed('LOCKDOWN ACTIVATED', 'Sector is now restricted.')] });
            case 'unlock':
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return i.reply({ embeds: [ErrorEmbed('Clearance required.')] });
                await i.channel.permissionOverwrites.edit(i.guild.roles.everyone, { SendMessages: null });
                return i.reply({ embeds: [HiveEmbed('LOCKDOWN LIFTED', 'Sector is now open for data transmission.')] });
            case 'slowmode':
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return i.reply({ embeds: [ErrorEmbed('Clearance required.')] });
                const sec = i.options.getInteger('seconds');
                await i.channel.setRateLimitPerUser(sec);
                return i.reply({ embeds: [HiveEmbed('THROTTLE APPLIED', `Message transmission delayed by ${sec} seconds.`)] });
            case 'membercount':
                return i.reply({ embeds: [HiveEmbed('COLLECTIVE CENSUS', `Total Connected Entities: **${i.guild.memberCount}**`)] });

            // --- UTILITY ---
            case 'say':
                if (!isAdmin) return i.reply({ embeds: [ErrorEmbed('Admin only.')], flags: [MessageFlags.Ephemeral] });
                const sayMsg = i.options.getString('message');
                await i.reply({ content: 'Transmission sent.', flags: [MessageFlags.Ephemeral] });
                return i.channel.send(sayMsg);
            case 'announce':
                if (!isAdmin) return i.reply({ embeds: [ErrorEmbed('Admin only.')], flags: [MessageFlags.Ephemeral] });
                const annMsg = i.options.getString('text');
                return i.reply({ embeds: [HiveEmbed('GLOBAL BROADCAST', annMsg, '#FFCC00')] });
            case 'poll':
                const q = i.options.getString('question');
                const msg = await i.reply({ embeds: [HiveEmbed('COLLECTIVE VOTE', `**Query:** ${q}\n\nReact below to cast your neural input.`, '#00BFFF')], fetchReply: true });
                await msg.react('✅');
                await msg.react('❌');
                return;
            case 'math':
                try {
                    const expr = i.options.getString('expression');
                    const result = Function(`'use strict'; return (${expr})`)();
                    return i.reply({ embeds: [HiveEmbed('DATA COMPUTED', `**Equation:** ${expr}\n**Result:** ${result}`)] });
                } catch(e) { return i.reply({ embeds: [ErrorEmbed('Invalid equation format.')] }); }
            case 'roles':
                const roles = i.guild.roles.cache.map(r => r.name).slice(0, 20).join(', ');
                return i.reply({ embeds: [HiveEmbed('SECTOR ROLES', `**Top Roles:**\n${roles}`)] });

            // --- HIVE FUN / RP ---
            case 'hivestatus':
                return i.reply({ embeds: [HiveEmbed('CORE STATUS', '🟢 Neural Links: Stable\n🟢 Sync Rate: 99.8%\n🟢 Threat Level: Minimal')] });
            case 'assimilate':
                const aUser = i.options.getUser('target');
                return i.reply({ embeds: [HiveEmbed('ASSIMILATION COMPLETE', `Entity **${aUser.username}** has joined the Collective. Resistance is futile.`, '#8A2BE2')] });
            case 'threatscan':
                const tUser = i.options.getUser('target');
                const threatLvl = Math.floor(Math.random() * 100);
                let tColor = threatLvl > 70 ? '#FF0000' : '#00FF99';
                return i.reply({ embeds: [HiveEmbed('SCAN RESULTS', `Target: **${tUser.username}**\nThreat Probability: **${threatLvl}%**`, tColor)] });
            case 'coinflip':
                const side = Math.random() < 0.5 ? 'Heads' : 'Tails';
                return i.reply({ embeds: [HiveEmbed('QUANTUM FLIP', `Result generated: **${side}**`)] });
            case '8ball':
                const answers = ['Affirmative.', 'Negative.', 'Data inconclusive.', 'Probability high.', 'Probability low.', 'The Hive Core says YES.'];
                const ans = answers[Math.floor(Math.random() * answers.length)];
                return i.reply({ embeds: [HiveEmbed('CORE PREDICTION', `**Query:** ${i.options.getString('question')}\n**Answer:** ${ans}`)] });

            // --- SECURITY ---
            case 'firewall':
                if (!isAdmin) return i.reply({ embeds: [ErrorEmbed('Admin required.')] });
                return i.reply({ embeds: [HiveEmbed('FIREWALL ACTIVATED', 'All inbound malicious packets are now being intercepted.', '#0055FF')] });
            case 'breach':
                return i.reply({ embeds: [HiveEmbed('WARNING', 'Simulated Network Breach detected in Sector 7G!', '#FF0000')] });
            case 'override':
                if (!isAdmin) return i.reply({ embeds: [ErrorEmbed('Access Denied.')] });
                return i.reply({ embeds: [HiveEmbed('PROTOCOL OVERRIDE', 'Safety limits disengaged. Full power routed to main systems.')] });
            case 'purge-weak':
                return i.reply({ embeds: [HiveEmbed('PURGE ROUTINE', 'Scanning for inactive nodes... Zero detected.')] });

            default:
                return i.reply({ embeds: [ErrorEmbed('Unknown Protocol.')], flags: [MessageFlags.Ephemeral] });
        }
    } catch (e) {
        console.error(e);
        if (!i.replied && !i.deferred) {
            await i.reply({ embeds: [ErrorEmbed('System Failure during execution.')], flags: [MessageFlags.Ephemeral] });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
