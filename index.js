const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const embed = new EmbedBuilder().setColor('#ff0000').setTimestamp();

    if (i.commandName === 'ping') {
        await i.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`${client.ws.ping}ms`)] });
    } 
    else if (i.commandName === 'server') {
        await i.reply({ embeds: [embed.setTitle('🏰 Server Info').setDescription(`Members: ${i.guild.memberCount}`)] });
    } 
    else if (i.commandName === 'userinfo') {
        const u = i.options.getUser('target') || i.user;
        await i.reply({ embeds: [embed.setTitle(`👤 Scan: ${u.username}`).setDescription(`ID: ${u.id}`)] });
    } 
    else if (i.commandName === 'ban') {
        const t = i.options.getMember('target');
        if (!t) return i.reply({ content: '❌ Target not found.', ephemeral: true });
        await t.ban();
        await i.reply({ embeds: [embed.setTitle('🔨 Banned').setDescription(`${t.user.tag} purged.`)] });
    }
});

client.login(process.env.DISCORD_TOKEN);
