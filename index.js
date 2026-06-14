const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const embed = new EmbedBuilder().setColor('#ff0000').setTimestamp();
    const cmd = i.commandName;

    try {
        if (cmd === 'ping') await i.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`${client.ws.ping}ms`)] });
        else if (cmd === 'ban') {
            const t = i.options.getMember('target');
            if(!t || !i.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return i.reply({content: '❌ No permission.', flags: [MessageFlags.Ephemeral]});
            await t.ban();
            await i.reply({embeds: [embed.setTitle('🔨 Banned').setDescription(`${t.user.tag} purged.`)]});
        }
        else if (cmd === 'clear') {
            const amt = i.options.getInteger('amount') || 1;
            await i.channel.bulkDelete(amt);
            await i.reply({content: `✅ Cleared ${amt} logs.`, flags: [MessageFlags.Ephemeral]});
        }
        else {
            await i.reply({content: `Protocol ${cmd} is active.`, flags: [MessageFlags.Ephemeral]});
        }
    } catch (e) { console.log(e); }
});

client.login(process.env.DISCORD_TOKEN);
