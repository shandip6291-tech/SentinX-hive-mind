const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const http = require('http');

// Render port binding fix
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('SentinX Security Cluster: Online');
});
server.listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    
    // Command Logic
    const cmd = i.commandName;
    const embed = new EmbedBuilder().setColor('#ff0000').setTimestamp();

    try {
        if (cmd === 'ping') {
            await i.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`${client.ws.ping}ms`)] });
        } 
        else if (cmd === 'ban') {
            const target = i.options.getMember('target');
            if (!target) return i.reply({ content: '❌ Target not found.', flags: [MessageFlags.Ephemeral] });
            await target.ban({ reason: 'Security Breach' });
            await i.reply({ embeds: [embed.setTitle('🔨 Banned').setDescription(`${target.user.tag} purged.`)] });
        }
        else {
            // Default response agar koi command ka logic nahi likha
            await i.reply({ content: `Protocol **${cmd.toUpperCase()}** is active.`, flags: [MessageFlags.Ephemeral] });
        }
    } catch (e) {
        console.error(e);
        await i.reply({ content: '❌ System Error.', flags: [MessageFlags.Ephemeral] });
    }
});

client.login(process.env.DISCORD_TOKEN);
