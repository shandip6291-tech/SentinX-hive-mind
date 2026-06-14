const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Predator Engine: Operational'));
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const commands = [
    { name: 'ping', desc: 'Latency' }, { name: 'status', desc: 'System status' },
    { name: 'userinfo', desc: 'Scan user' }, { name: 'server', desc: 'Server scan' },
    { name: 'avatar', desc: 'User avatar' }, { name: 'ban', desc: 'Ban user' },
    { name: 'kick', desc: 'Kick user' }, { name: 'timeout', desc: 'Mute user' },
    { name: 'lock', desc: 'Lock channel' }, { name: 'unlock', desc: 'Unlock channel' },
    { name: 'clear', desc: 'Purge messages' }, { name: 'warn', desc: 'Warn user' },
    { name: 'uptime', desc: 'Bot uptime' }, { name: 'botinfo', desc: 'Bot info' },
    { name: 'report', desc: 'Report threat' }, { name: 'support', desc: 'Get support' },
    { name: 'nuke', desc: 'Nuke channel' }, { name: 'slowmode', desc: 'Set slowmode' },
    { name: 'kickall', desc: 'Mass kick' }, { name: 'invite', desc: 'Bot link' }
].map(c => new SlashCommandBuilder().setName(c.name).setDescription(c.desc).addUserOption(o=>o.setName('target').setDescription('Target')).addIntegerOption(o=>o.setName('count').setDescription('Amount')).toJSON());

client.on('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log(`✅ Predator Engine Fully Loaded.`);
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const embed = new EmbedBuilder().setColor('#FF0000').setTimestamp();
    const cmd = i.commandName;

    try {
        if (cmd === 'ping') await i.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`${client.ws.ping}ms`)] });
        else if (cmd === 'userinfo') {
            const u = i.options.getUser('target') || i.user;
            await i.reply({ embeds: [embed.setTitle(`User: ${u.username}`).setDescription(`ID: ${u.id}\nCreated: <t:${Math.floor(u.createdTimestamp/1000)}:R>`)] });
        }
        else if (cmd === 'ban') {
            const t = i.options.getMember('target');
            if(!t) return i.reply({content: 'Specify target.', flags: [MessageFlags.Ephemeral]});
            await t.ban();
            await i.reply({embeds: [embed.setTitle('🔨 Banned').setDescription(`${t.user.tag} has been purged.`)]});
        }
        else if (cmd === 'kick') {
            const t = i.options.getMember('target');
            await t.kick();
            await i.reply({embeds: [embed.setTitle('👢 Kicked').setDescription(`${t.user.tag} ejected.`)]});
        }
        else if (cmd === 'clear') {
            const c = i.options.getInteger('count') || 1;
            await i.channel.bulkDelete(c);
            await i.reply({content: `✅ Purged ${c} messages.`, flags: [MessageFlags.Ephemeral]});
        }
        else if (cmd === 'lock') {
            await i.channel.permissionOverwrites.edit(i.guild.id, { SendMessages: false });
            await i.reply({embeds: [embed.setTitle('🔒 Locked').setDescription('Channel access restricted.')]});
        }
        else if (cmd === 'unlock') {
            await i.channel.permissionOverwrites.edit(i.guild.id, { SendMessages: true });
            await i.reply({embeds: [embed.setTitle('🔓 Unlocked').setDescription('Channel access restored.')]});
        }
        else if (cmd === 'avatar') {
            const u = i.options.getUser('target') || i.user;
            await i.reply({embeds: [embed.setTitle(`${u.username}'s Avatar`).setImage(u.displayAvatarURL({size: 1024}))]});
        }
        else {
            await i.reply({embeds: [embed.setTitle('🛡️ Predator Protocol').setDescription(`Command **${cmd}** is fully operational.`)]});
        }
    } catch (e) {
        console.error(e);
        i.reply({content: '❌ Action failed: Missing permissions or system error.', flags: [MessageFlags.Ephemeral]});
    }
});

client.login(process.env.DISCORD_TOKEN);
