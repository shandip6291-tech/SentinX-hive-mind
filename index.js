const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const http = require('http');

// Render ke liye port binding
http.createServer((req, res) => res.end('Online')).listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] 
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    
    const cmd = i.commandName.toLowerCase();
    const embed = new EmbedBuilder().setColor('#ff0000').setTimestamp();

    // LOGIC BLOCK (Yahan command name match hoga)
    if (cmd === 'ping') {
        await i.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`${client.ws.ping}ms`)] });
    } 
    else if (cmd === 'userinfo') {
        const u = i.options.getUser('target') || i.user;
        await i.reply({ embeds: [embed.setTitle(`👤 Scan: ${u.username}`).setDescription(`ID: ${u.id}`)] });
    }
    else if (cmd === 'ban') {
        const t = i.options.getMember('target');
        if(!t) return i.reply({content: '❌ Target missing', flags: [MessageFlags.Ephemeral]});
        await t.ban();
        await i.reply({embeds: [embed.setTitle('🔨 Banned').setDescription(`${t.user.tag} purged.`)]});
    }
    else {
        // Agar yahan ata hai, toh matlab register.js mein command hai par yahan logic nahi
        await i.reply({ content: `✅ Command '${cmd}' received. Logic pending.`, flags: [MessageFlags.Ephemeral] });
    }
});

client.login(process.env.DISCORD_TOKEN);
