const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('SentinX Security Core: Operational'));
app.listen(process.env.PORT || 3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

const commands = [
    new SlashCommandBuilder().setName('ban').setDescription('Permanently remove a member').addUserOption(o => o.setName('target').setDescription('Member').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Legal reason')),
    new SlashCommandBuilder().setName('kick').setDescription('Eject a member').addUserOption(o => o.setName('target').setDescription('Member').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('timeout').setDescription('Mute a member temporarily').addUserOption(o => o.setName('target').setDescription('Member').setRequired(true)).addIntegerOption(o => o.setName('mins').setDescription('Duration in minutes').setRequired(true)),
    new SlashCommandBuilder().setName('clear').setDescription('Purge chat logs').addIntegerOption(o => o.setName('count').setDescription('1-100 messages').setRequired(true)),
    new SlashCommandBuilder().setName('avatar').setDescription('Fetch member visual profile').addUserOption(o => o.setName('target').setDescription('Member')),
    new SlashCommandBuilder().setName('userinfo').setDescription('Scan member metadata').addUserOption(o => o.setName('target').setDescription('Member')),
    new SlashCommandBuilder().setName('server').setDescription('Fetch server security metrics'),
    new SlashCommandBuilder().setName('ping').setDescription('Test system latency')
].map(c => c.toJSON());

client.on('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log(`✅ SentinX Enforcement System Online.`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const embed = new EmbedBuilder().setColor('#FF3B30').setTimestamp().setFooter({ text: 'SentinX Security Core | Authorized Access' });
    const { options, member, guild, channel } = interaction;

    try {
        // --- ENFORCEMENT ---
        if (interaction.commandName === 'ban') {
            if (!member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: '❌ Access Denied.', ephemeral: true });
            const target = options.getMember('target');
            await target.ban({ reason: options.getString('reason') || 'No reason provided' });
            await interaction.reply({ embeds: [embed.setTitle('🔨 Ban Successful').setDescription(`**Target:** ${target.user.tag}\n**Status:** Permanently removed from perimeter.`)] });
        }
        else if (interaction.commandName === 'kick') {
            if (!member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({ content: '❌ Access Denied.', ephemeral: true });
            const target = options.getMember('target');
            await target.kick();
            await interaction.reply({ embeds: [embed.setTitle('👢 Kick Successful').setDescription(`**Target:** ${target.user.tag}\n**Status:** Ejected from server.`)] });
        }
        else if (interaction.commandName === 'timeout') {
            const target = options.getMember('target');
            const mins = options.getInteger('mins');
            await target.timeout(mins * 60 * 1000);
            await interaction.reply({ embeds: [embed.setTitle('🔇 Timeout Active').setDescription(`**Target:** ${target.user.tag}\n**Duration:** ${mins} Minutes.`)] });
        }
        // --- UTILITY ---
        else if (interaction.commandName === 'clear') {
            if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: '❌ Access Denied.', ephemeral: true });
            const count = options.getInteger('count');
            await channel.bulkDelete(count);
            await interaction.reply({ content: `✅ Purged ${count} malicious logs.`, ephemeral: true });
        }
        else if (interaction.commandName === 'avatar') {
            const user = options.getUser('target') || interaction.user;
            await interaction.reply({ embeds: [embed.setTitle(`👤 Profile: ${user.username}`).setImage(user.displayAvatarURL({ size: 1024 }))] });
        }
        else if (interaction.commandName === 'userinfo') {
            const user = options.getUser('target') || interaction.user;
            const memberData = await guild.members.fetch(user.id);
            embed.setTitle(`🛡️ Security Scan: ${user.username}`)
                 .addFields(
                    { name: 'User ID', value: user.id, inline: true },
                    { name: 'Joined', value: `<t:${Math.floor(memberData.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Roles', value: `${memberData.roles.cache.map(r => r.name).join(', ')}` }
                 );
            await interaction.reply({ embeds: [embed] });
        }
        else if (interaction.commandName === 'server') {
            embed.setTitle(`🏰 Server Analytics`).addFields(
                { name: 'Total Entities', value: `${guild.memberCount}`, inline: true },
                { name: 'Verification', value: `${guild.verificationLevel}`, inline: true },
                { name: 'Security Level', value: 'High-Alert', inline: true }
            );
            await interaction.reply({ embeds: [embed] });
        }
        else if (interaction.commandName === 'ping') {
            await interaction.reply({ embeds: [embed.setTitle('📡 Connection Status').setDescription(`Latency: ${client.ws.ping}ms`)] });
        }
    } catch (e) {
        console.error(e);
        await interaction.reply({ content: '❌ System Error: Execution failed.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
