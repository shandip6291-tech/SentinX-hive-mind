const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
require('express')().listen(process.env.PORT || 3000); // Port binding fix

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

// COMMANDS REGISTRY
const commands = [
    { name: 'ping', desc: 'Latency check' }, { name: 'ban', desc: 'Ban user' }, 
    { name: 'kick', desc: 'Kick user' }, { name: 'clear', desc: 'Purge messages' },
    { name: 'userinfo', desc: 'Scan user' }, { name: 'avatar', desc: 'Get avatar' },
    { name: 'status', desc: 'Bot status' }, { name: 'server', desc: 'Server info' }
].map(c => new SlashCommandBuilder().setName(c.name).setDescription(c.desc)
    .addUserOption(o => o.setName('target').setDescription('User'))
    .addIntegerOption(o => o.setName('amount').setDescription('Number')).toJSON());

client.on('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('✅ Predator Engine Locked & Loaded.');
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    
    const embed = new EmbedBuilder().setColor('#ff0000').setTimestamp();
    const cmd = i.commandName;

    // --- LOGIC GATEWAY ---
    if (cmd === 'ping') await i.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`${client.ws.ping}ms`)] });
    
    else if (cmd === 'ban') {
        const t = i.options.getMember('target');
        if(!t || !i.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return i.reply({content: '❌ No permission.', flags: [MessageFlags.Ephemeral]});
        await t.ban();
        await i.reply({embeds: [embed.setTitle('🔨 Banned').setDescription(`${t.user.tag} has been purged.`)]});
    }

    else if (cmd === 'kick') {
        const t = i.options.getMember('target');
        if(!t || !i.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return i.reply({content: '❌ No permission.', flags: [MessageFlags.Ephemeral]});
        await t.kick();
        await i.reply({embeds: [embed.setTitle('👢 Kicked').setDescription(`${t.user.tag} ejected.`)]});
    }

    else if (cmd === 'clear') {
        const amt = i.options.getInteger('amount') || 1;
        await i.channel.bulkDelete(amt);
        await i.reply({content: `✅ Cleared ${amt} logs.`, flags: [MessageFlags.Ephemeral]});
    }

    else if (cmd === 'userinfo') {
        const u = i.options.getUser('target') || i.user;
        await i.reply({embeds: [embed.setTitle(`👤 Scan: ${u.username}`).setDescription(`ID: ${u.id}`)]});
    }
    
    else {
        // Fallback agar koi command logic mein missing hai
        await i.reply({content: `Protocol ${cmd} is active.`, flags: [MessageFlags.Ephemeral]});
    }
});

client.login(process.env.DISCORD_TOKEN);
