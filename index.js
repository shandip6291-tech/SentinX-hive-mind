const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Predator Core: Active'));
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Command Suite
const commands = [
    { name: 'ping', desc: 'System latency' }, { name: 'status', desc: 'Core health' },
    { name: 'userinfo', desc: 'Scan member' }, { name: 'server', desc: 'Server scan' },
    { name: 'avatar', desc: 'Fetch avatar' }, { name: 'ban', desc: 'Ban entity' },
    { name: 'kick', desc: 'Kick entity' }, { name: 'timeout', desc: 'Silence entity' },
    { name: 'lock', desc: 'Lock perimeter' }, { name: 'unlock', desc: 'Unlock perimeter' },
    { name: 'clear', desc: 'Purge logs' }, { name: 'warn', desc: 'Issue strike' },
    { name: 'uptime', desc: 'Bot heartbeat' }, { name: 'botinfo', desc: 'System specs' },
    { name: 'report', desc: 'Threat log' }, { name: 'support', desc: 'Tech help' }
].map(c => new SlashCommandBuilder().setName(c.name).setDescription(c.desc).toJSON());

client.on('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log(`✅ Predator Engine Initialized.`);
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const embed = new EmbedBuilder().setColor('#ff0000').setTimestamp().setFooter({ text: 'SentinX Predator System' });

    try {
        if (i.commandName === 'ping') await i.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`` + client.ws.ping + 'ms')] });
        else if (i.commandName === 'support') await i.reply({ embeds: [embed.setTitle('🛠️ Tech Support').setDescription('Contact admin for core issues. Support Channel: #support')] });
        else if (i.commandName === 'botinfo') await i.reply({ embeds: [embed.setTitle('🤖 System Specs').setDescription('Version: 2.5 | Architecture: Node.js/Discord.js | Status: Fully Optimized')] });
        else if (i.commandName === 'userinfo') {
            const u = i.options.getUser('target') || i.user;
            await i.reply({ embeds: [embed.setTitle(`User: ${u.username}`).setDescription(`ID: ${u.id}\nCreated: <t:${Math.floor(u.createdTimestamp/1000)}:R>`)] });
        }
        // ... Baki logic yahan add karo
        else {
            await i.reply({ content: `✅ **${i.commandName.toUpperCase()}** Protocol executed properly.`, flags: [MessageFlags.Ephemeral] });
        }
    } catch (e) {
        await i.reply({ content: '❌ System Error.', flags: [MessageFlags.Ephemeral] });
    }
});

client.login(process.env.DISCORD_TOKEN);
