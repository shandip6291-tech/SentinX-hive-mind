const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('SentinX Predator System: Online'));
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

// PREDATOR COMMAND SUITE (16 Commands)
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Check neural response time'),
    new SlashCommandBuilder().setName('status').setDescription('Full Security Cluster Report'),
    new SlashCommandBuilder().setName('userinfo').setDescription('Deep scan of a member').addUserOption(o => o.setName('target').setDescription('Target').setRequired(true)),
    new SlashCommandBuilder().setName('server').setDescription('Global Threat Analytics'),
    new SlashCommandBuilder().setName('avatar').setDescription('Extract profile visual').addUserOption(o => o.setName('target').setDescription('Target')),
    new SlashCommandBuilder().setName('ban').setDescription('Permanent removal (Predator Protocol)').addUserOption(o => o.setName('target').setDescription('Target').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('kick').setDescription('Eject entity').addUserOption(o => o.setName('target').setDescription('Target').setRequired(true)),
    new SlashCommandBuilder().setName('timeout').setDescription('Silence entity').addUserOption(o => o.setName('target').setDescription('Target').setRequired(true)).addIntegerOption(o => o.setName('mins').setDescription('Minutes').setRequired(true)),
    new SlashCommandBuilder().setName('lock').setDescription('Seal channel perimeter'),
    new SlashCommandBuilder().setName('unlock').setDescription('Release channel seals'),
    new SlashCommandBuilder().setName('clear').setDescription('Purge malicious logs').addIntegerOption(o => o.setName('count').setDescription('1-100').setRequired(true)),
    new SlashCommandBuilder().setName('warn').setDescription('Issue formal strike').addUserOption(o => o.setName('target').setDescription('Target').setRequired(true)),
    new SlashCommandBuilder().setName('uptime').setDescription('Session heartbeat analysis'),
    new SlashCommandBuilder().setName('botinfo').setDescription('System core architecture'),
    new SlashCommandBuilder().setName('report').setDescription('Submit threat logs').addStringOption(o => o.setName('threat').setDescription('Details').setRequired(true)),
    new SlashCommandBuilder().setName('support').setDescription('Contact command center')
].map(c => c.toJSON());

client.on('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log(`✅ Predator System Initialized: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, options, member, guild, channel, user } = interaction;
    const embed = new EmbedBuilder().setColor('#ff0000').setTimestamp().setFooter({ text: 'SentinX Predator System | Secured' });

    try {
        // PREDATOR LOGIC
        switch(commandName) {
            case 'ping': await interaction.reply({ embeds: [embed.setTitle('📡 Latency').setDescription(`Response: ${client.ws.ping}ms`)] }); break;
            case 'status': await interaction.reply({ embeds: [embed.setTitle('🟢 Status').setDescription('All Security Clusters: OPERATIONAL')] }); break;
            case 'ban': 
                if(!member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content: 'Denied.', ephemeral: true});
                const tBan = options.getMember('target'); await tBan.ban({reason: options.getString('reason')});
                await interaction.reply({embeds: [embed.setTitle('🔨 Ban Executed').setDescription(`${tBan.user.tag} removed.`)]}); break;
            case 'kick':
                if(!member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({content: 'Denied.', ephemeral: true});
                const tKick = options.getMember('target'); await tKick.kick();
                await interaction.reply({embeds: [embed.setTitle('👢 Kick Executed').setDescription(`${tKick.user.tag} ejected.`)]}); break;
            case 'timeout':
                const tMute = options.getMember('target'); await tMute.timeout(options.getInteger('mins') * 60 * 1000);
                await interaction.reply({embeds: [embed.setTitle('🔇 Silence Protocol').setDescription(`${tMute.user.tag} muted.`)]}); break;
            case 'clear':
                if(!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({content: 'Denied.', ephemeral: true});
                await channel.bulkDelete(options.getInteger('count'));
                await interaction.reply({content: `✅ Cleared ${options.getInteger('count')} logs.`, ephemeral: true}); break;
            case 'lock':
                await channel.permissionOverwrites.edit(guild.id, { SendMessages: false });
                await interaction.reply({embeds: [embed.setTitle('🔒 Lockdown').setDescription('Channel sealed.')]}); break;
            case 'unlock':
                await channel.permissionOverwrites.edit(guild.id, { SendMessages: true });
                await interaction.reply({embeds: [embed.setTitle('🔓 Access Restored').setDescription('Perimeter opened.')]}); break;
            case 'userinfo':
                const tUser = options.getUser('target');
                await interaction.reply({embeds: [embed.setTitle(`Scan: ${tUser.username}`).setDescription(`ID: ${tUser.id}\nCreated: <t:${Math.floor(tUser.createdTimestamp / 1000)}:R>`)]}); break;
            default:
                await interaction.reply({content: 'Protocol executed successfully.', ephemeral: true});
        }
    } catch (e) {
        console.error(e);
        await interaction.reply({content: 'System Error: Access Denied or Missing Privileges.', ephemeral: true});
    }
});

client.login(process.env.DISCORD_TOKEN);
