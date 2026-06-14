const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const http = require('http');

http.createServer((req, res) => res.end('Online')).listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// COMMAND REGISTRATION (Ye ready hote hi auto-register karega)
client.on('ready', async () => {
    const commands = [
        new SlashCommandBuilder().setName('ping').setDescription('Latency'),
        new SlashCommandBuilder().setName('userinfo').setDescription('Scan user').addUserOption(o=>o.setName('target').setDescription('User')),
        new SlashCommandBuilder().setName('server').setDescription('Server stats'),
        new SlashCommandBuilder().setName('ban').setDescription('Ban user').addUserOption(o=>o.setName('target').setDescription('User').setRequired(true)),
        new SlashCommandBuilder().setName('clear').setDescription('Purge').addIntegerOption(o=>o.setName('amount').setDescription('Count'))
    ];
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('✅ Predator Engine Locked.');
});

// AUTO-MODERATION (Xieron style)
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const badWords = ['gali1', 'gali2']; // Yahan bad words dal
    if (badWords.some(word => message.content.includes(word))) {
        await message.delete();
        message.channel.send(`⚠️ ${message.author.username}, don't use restricted content.`);
    }
});

// COMMAND HANDLER
client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const cmd = i.commandName;
    const embed = new EmbedBuilder().setColor('#ff0000').setTimestamp();

    if (cmd === 'ping') await i.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`${client.ws.ping}ms`)] });
    else if (cmd === 'server') await i.reply({ embeds: [embed.setTitle('🏰 Server Info').setDescription(`Members: ${i.guild.memberCount}`)] });
    else if (cmd === 'userinfo') {
        const u = i.options.getUser('target') || i.user;
        await i.reply({ embeds: [embed.setTitle(`👤 Info: ${u.username}`).setDescription(`ID: ${u.id}`)] });
    }
    else if (cmd === 'ban') {
        const t = i.options.getMember('target');
        if(!i.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return i.reply({content:'No perms.', flags: [MessageFlags.Ephemeral]});
        await t.ban();
        await i.reply({embeds: [embed.setTitle('🔨 Banned').setDescription(`${t.user.tag} purged.`)]});
    }
    else if (cmd === 'clear') {
        const amt = i.options.getInteger('amount') || 5;
        await i.channel.bulkDelete(amt);
        await i.reply({content: `✅ Cleared ${amt} logs.`, flags: [MessageFlags.Ephemeral]});
    }
});

client.login(process.env.DISCORD_TOKEN);
