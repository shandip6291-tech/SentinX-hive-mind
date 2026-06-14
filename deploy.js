const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    { name: 'ping', desc: 'Bot latency' },
    { name: 'ban', desc: 'Ban a member' },
    { name: 'kick', desc: 'Kick a member' },
    { name: 'clear', desc: 'Delete messages' },
    { name: 'userinfo', desc: 'Scan user profile' },
    { name: 'lock', desc: 'Lock channel' },
    { name: 'unlock', desc: 'Unlock channel' },
    { name: 'status', desc: 'System monitor' }
].map(c => new SlashCommandBuilder().setName(c.name).setDescription(c.desc).addUserOption(o=>o.setName('target').setDescription('Target')).addIntegerOption(o=>o.setName('amount').setDescription('Count')).toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Commands Successfully Registered.');
    } catch (e) { console.error(e); }
})();
