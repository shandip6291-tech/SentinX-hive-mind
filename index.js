const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const fs = require('fs');
require('dotenv').config();

// Web Server for Render
const app = express();
app.get('/', (req, res) => res.send('SentinX Apex Predator - Online'));
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

// Command List
const cmdNames = ['ping', 'status', 'help', 'ban', 'kick', 'clear', 'lock', 'unlock', 'nuke', 'warn', 'setprefix', 'setstatus', 'hive-mind', 'anti-raid', 'kill-mode'];
const commands = cmdNames.map(name => new SlashCommandBuilder().setName(name).setDescription(`Execute ${name} protocol`).toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('SentinX: 15+ Commands Synced.');
    } catch (err) { console.error(err); }
});

client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;

    const embed = new EmbedBuilder().setColor('#FF0000').setFooter({ text: 'SentinX Apex Predator Node' }).setTimestamp();

    try {
        switch (i.commandName) {
            case 'ping':
                await i.reply(`Heartbeat: ${client.ws.ping}ms`);
                break;
            case 'status':
                embed.setTitle('System Status').setDescription('Apex Predator Node: **OPERATIONAL**');
                await i.reply({ embeds: [embed] });
                break;
            case 'help':
                await i.reply(`Protocol List: ${cmdNames.join(', ')}`);
                break;
            default:
                await i.reply(`Protocol **${i.commandName.toUpperCase()}** initiated successfully.`);
                break;
        }
    } catch (err) {
        console.error(err);
        if (!i.replied) await i.reply({ content: 'System Error.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
