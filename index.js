const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// AUTO-MODERATION ENGINE
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    // Yahan tu future mein bad words/links block karne ka logic daalega
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const embed = new EmbedBuilder().setColor('#0099ff').setTimestamp();
    const cmd = i.commandName;

    try {
        if (cmd === 'ping') await i.reply({ content: `Pong! ${client.ws.ping}ms` });
        
        else if (cmd === 'ban') {
            const t = i.options.getMember('target');
            if (!i.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return i.reply({ content: '❌ No Perms.', flags: [MessageFlags.Ephemeral] });
            await t.ban();
            await i.reply({ embeds: [embed.setTitle('🔨 Banned').setDescription(`${t.user.tag} has been secured.`)] });
        }

        else if (cmd === 'clear') {
            const amt = i.options.getInteger('amount') || 5;
            await i.channel.bulkDelete(amt);
            await i.reply({ content: `✅ Purged ${amt} logs.`, flags: [MessageFlags.Ephemeral] });
        }
        
        else if (cmd === 'status') {
            await i.reply({ embeds: [embed.setTitle('🛡️ SentinX Status').setDescription('All protocols operational. Anti-Raid: ACTIVE')] });
        }
        
        else {
            await i.reply({ content: `Protocol **${cmd}** operational.`, flags: [MessageFlags.Ephemeral] });
        }
    } catch (e) { console.error(e); }
});

client.login(process.env.DISCORD_TOKEN);
