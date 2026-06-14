const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, MessageFlags, REST, Routes, SlashCommandBuilder } = require('discord.js');
const http = require('http');

http.createServer((req, res) => res.end('SentinX Online')).listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// COMMANDS DEFINITION (Sirf yahi array modify karna)
const commands = [
    { name: 'ping', desc: 'Latency' },
    { name: 'server', desc: 'Server stats' },
    { name: 'userinfo', desc: 'Member scan' },
    { name: 'ban', desc: 'Ban user' }
].map(c => new SlashCommandBuilder().setName(c.name).setDescription(c.desc).addUserOption(o=>o.setName('target').setDescription('Target')).toJSON());

client.on('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('✅ Commands Locked. Engine Operational.');
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    
    const embed = new EmbedBuilder().setColor('#ff0000').setTimestamp();
    const cmd = i.commandName;

    // LOGIC ROUTER
    try {
        if (cmd === 'ping') {
            await i.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`${client.ws.ping}ms`)] });
        } 
        else if (cmd === 'server') {
            await i.reply({ embeds: [embed.setTitle('🏰 Server').setDescription(`Members: ${i.guild.memberCount}`)] });
        }
        else if (cmd === 'userinfo') {
            const u = i.options.getUser('target') || i.user;
            await i.reply({ embeds: [embed.setTitle(`👤 Info: ${u.username}`).setDescription(`ID: ${u.id}`)] });
        }
        else if (cmd === 'ban') {
            const t = i.options.getMember('target');
            if(!t) return i.reply({content: '❌ Target missing', flags: [MessageFlags.Ephemeral]});
            await t.ban();
            await i.reply({embeds: [embed.setTitle('🔨 Banned').setDescription(`${t.user.tag} purged.`)]});
        }
    } catch (e) {
        console.error(e);
        await i.reply({content: '❌ Error: Execution failed.', flags: [MessageFlags.Ephemeral]});
    }
});

client.login(process.env.DISCORD_TOKEN);
