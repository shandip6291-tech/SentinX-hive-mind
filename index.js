const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const http = require('http');

// Render Server Keep-Alive
http.createServer((req, res) => res.end('Hivemind Core: ACTIVE')).listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildModeration] 
});

// 👑 VASUDEV ROY (Developer ID Locked)
const DEV_ID = '1355243385572556941'; 

// ==========================================
// 🎨 MINIMALIST PREMIUM UI GENERATOR
// ==========================================
const brandColor = '#2B2D31'; // Discord's native dark canvas tint

const MinimalEmbed = (title, description = null) => {
    const embed = new EmbedBuilder()
        .setColor(brandColor)
        .setAuthor({ name: title, iconURL: client.user?.displayAvatarURL() })
        .setFooter({ text: 'Hivemind Security Protocol • Developed by Vasudev Roy • © 2026', iconURL: 'https://cdn-icons-png.flaticon.com/512/6599/6599981.png' })
        .setTimestamp();
    if (description) embed.setDescription(description);
    return embed;
};

// ==========================================
// 🚀 COMMANDS REGISTRY (Keeps all old + adds 2 new ones)
// ==========================================
const commandsData = [
    new SlashCommandBuilder().setName('ping').setDescription('Check system latency'),
    new SlashCommandBuilder().setName('serverinfo').setDescription('Detailed server data'),
    new SlashCommandBuilder().setName('userinfo').setDescription('Detailed entity scan').addUserOption(o => o.setName('target').setDescription('Select user')),
    new SlashCommandBuilder().setName('roles').setDescription('List all roles (Scrollable)'),
    new SlashCommandBuilder().setName('ban').setDescription('Eradicate a threat').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('clear').setDescription('Purge messages').addIntegerOption(o => o.setName('amount').setDescription('Count (1-100)').setRequired(true)),
    new SlashCommandBuilder().setName('lock').setDescription('Lock down current sector'),
    new SlashCommandBuilder().setName('unlock').setDescription('Unlock current sector'),
    new SlashCommandBuilder().setName('threatscan').setDescription('Scan user for threats').addUserOption(o => o.setName('target').setDescription('User').setRequired(true)),
    
    // 👑 NEW ROLE UTILITY COMMANDS
    new SlashCommandBuilder().setName('role_icon')
        .setDescription('Modify a role icon and hex color (Admin/Owner Only)')
        .addRoleOption(o => o.setName('role').setDescription('Select the target role').setRequired(true))
        .addStringOption(o => o.setName('color').setDescription('Hex Color Code (e.g., #FF0000)').setRequired(true))
        .addStringOption(o => o.setName('icon_url').setDescription('URL of the icon image (Must be from this server context)').setRequired(false)),

    new SlashCommandBuilder().setName('role_create')
        .setDescription('Instantly forge a new server role')
        .addStringOption(o => o.setName('name').setDescription('Enter role name').setRequired(true))
        .addBooleanOption(o => o.setName('display').setDescription('Display role separately in member list? (True/False)').setRequired(true)),

    // 🌍 HIVEMIND GLOBAL PROTOCOLS (DEV ONLY)
    new SlashCommandBuilder().setName('hivemind_nuke').setDescription('⚠️ GLOBAL LOCKDOWN & BAN (Dev Only)').addUserOption(o => o.setName('target').setDescription('Culprit to globally ban').setRequired(true)),
    new SlashCommandBuilder().setName('hivemind_restore').setDescription('✅ GLOBAL UNLOCK (Dev Only)')
].map(c => c.toJSON());

client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        console.log('🔄 Syncing All Hivemind Protocols...');
        await rest.put(Routes.applicationCommands(client.user.id), { body: commandsData });
        console.log(`✅ [HIVEMIND] Online. 13 Protocols Deployed. Developer: Vasudev Roy.`);
    } catch (e) { console.error(e); }
});

// ==========================================
// 🧠 PAGINATION (SCROLLING) SYSTEM
// ==========================================
async function paginate(interaction, pages) {
    if (pages.length === 1) return interaction.editReply({ embeds: [pages[0]] });

    let index = 0;
    const btnPrev = new ButtonBuilder().setCustomId('prev').setLabel('◀ Previous').setStyle(ButtonStyle.Secondary);
    const btnNext = new ButtonBuilder().setCustomId('next').setLabel('Next ▶').setStyle(ButtonStyle.Primary);

    const getRow = () => new ActionRowBuilder().addComponents(
        btnPrev.setDisabled(index === 0),
        btnNext.setDisabled(index === pages.length - 1)
    );

    const msg = await interaction.editReply({ embeds: [pages[index]], components: [getRow()] });
    
    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
    collector.on('collect', async i => {
        if (i.user.id !== interaction.user.id) return i.reply({ content: 'This menu is restricted to the executioner.', ephemeral: true });
        await i.deferUpdate();
        index = i.customId === 'prev' ? index - 1 : index + 1;
        await interaction.editReply({ embeds: [pages[index]], components: [getRow()] });
    });
    collector.on('end', () => interaction.editReply({ components: [] }).catch(() => {}));
}

// ==========================================
// ⚡ MAIN LOGIC ROUTER
// ==========================================
client.on('interactionCreate', async i => {
    if (!i.isChatInputCommand()) return;
    const cmd = i.commandName;

    // Ephemeral setup for silent cleanup execution
    await i.deferReply({ ephemeral: cmd === 'clear' }); 

    try {
        // Checking Admin / Owner status for specific administrative operations
        const isAdminOrOwner = i.member.permissions.has(PermissionsBitField.Flags.Administrator) || i.guild.ownerId === i.user.id;

        switch (cmd) {
            case 'ping':
                const pingEmbed = MinimalEmbed('System Latency')
                    .addFields(
                        { name: 'API Latency', value: `\`${client.ws.ping}ms\``, inline: true },
                        { name: 'Client Ping', value: `\`${Date.now() - i.createdTimestamp}ms\``, inline: true }
                    );
                return i.editReply({ embeds: [pingEmbed] });

            case 'serverinfo':
                const serverEmbed = MinimalEmbed('Server Intelligence')
                    .setThumbnail(i.guild.iconURL({ size: 1024 }))
                    .addFields(
                        { name: 'Designation', value: `${i.guild.name}`, inline: true },
                        { name: 'Server ID', value: `\`${i.guild.id}\``, inline: true },
                        { name: 'Owner', value: `<@${i.guild.ownerId}>`, inline: true },
                        { name: 'Member Count', value: `${i.guild.memberCount} Entities`, inline: true },
                        { name: 'Creation Date', value: `<t:${Math.floor(i.guild.createdTimestamp / 1000)}:D>`, inline: true }
                    );
                return i.editReply({ embeds: [serverEmbed] });

            case 'userinfo':
                const user = i.options.getUser('target') || i.user;
                const member = i.guild.members.cache.get(user.id);
                const userEmbed = MinimalEmbed('Entity Profile')
                    .setThumbnail(user.displayAvatarURL({ size: 1024 }))
                    .addFields(
                        { name: 'Username', value: user.tag, inline: true },
                        { name: 'Entity ID', value: `\`${user.id}\``, inline: true },
                        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: 'Server Joined', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Not in server', inline: true }
                    );
                return i.editReply({ embeds: [userEmbed] });

            case 'roles':
                const roles = i.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => `${r} \`[${r.id}]\``);
                const pages = [];
                for (let j = 0; j < roles.length; j += 15) {
                    const chunk = roles.slice(j, j + 15).join('\n');
                    pages.push(MinimalEmbed(`Server Roles • Page ${Math.floor(j / 15) + 1}`).setDescription(chunk));
                }
                return paginate(i, pages);

            case 'ban':
                if (!i.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return i.editReply({ embeds: [MinimalEmbed('Access Denied', 'Insufficient clearance to eradicate entities.')] });
                const bTarget = i.options.getMember('target');
                if (!bTarget) return i.editReply({ embeds: [MinimalEmbed('Error', 'Target not found.')] });
                await bTarget.ban({ reason: `Eradicated by ${i.user.tag}` });
                return i.editReply({ embeds: [MinimalEmbed('Entity Eradicated', `**${bTarget.user.tag}** has been successfully purged from the sector.`)] });

            case 'clear':
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return i.editReply({ embeds: [MinimalEmbed('Access Denied', 'Insufficient clearance.')] });
                const amt = i.options.getInteger('amount');
                await i.channel.bulkDelete(amt, true);
                return i.editReply({ embeds: [MinimalEmbed('Data Purged', `Deleted **${amt}** records from the channel log.`)] });

            case 'lock':
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return i.editReply({ embeds: [MinimalEmbed('Access Denied', 'Insufficient clearance.')] });
                await i.channel.permissionOverwrites.edit(i.guild.roles.everyone, { SendMessages: false });
                return i.editReply({ embeds: [MinimalEmbed('Sector Locked', 'Communication channels restricted.')] });

            case 'unlock':
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return i.editReply({ embeds: [MinimalEmbed('Access Denied', 'Insufficient clearance.')] });
                await i.channel.permissionOverwrites.edit(i.guild.roles.everyone, { SendMessages: null });
                return i.editReply({ embeds: [MinimalEmbed('Sector Unlocked', 'Communication channels restored.')] });

            case 'threatscan':
                const tTarget = i.options.getUser('target');
                const risk = Math.floor(Math.random() * 100);
                const status = risk > 75 ? '🔴 HIGH THREAT' : risk > 30 ? '🟡 MODERATE RISK' : '🟢 SECURE';
                return i.editReply({ embeds: [MinimalEmbed('Security Scan Results').addFields({ name: `Target: ${tTarget.tag}`, value: `Threat Level: **${risk}%**\nStatus: **${status}**` })] });

            // 👑 NEW: ROLE ICON & COLOR LOGIC
            case 'role_icon':
                if (!isAdminOrOwner) return i.editReply({ embeds: [MinimalEmbed('Access Denied', 'This command is strictly locked to Server Admins and the Server Owner.')] });
                
                const targetRole = i.options.getRole('role');
                const hexColor = i.options.getString('color');
                const iconUrl = i.options.getString('icon_url');

                // Validating Hex Code Format
                if (!/^#([A-Fa-f0-9]{6})$/.test(hexColor)) {
                    return i.editReply({ embeds: [MinimalEmbed('Modification Failed', 'Invalid Hex Color code format. Please use formats like `#FF0000`.')] });
                }

                // Check bot hierarchy permissions
                if (targetRole.position >= i.guild.members.me.roles.highest.position) {
                    return i.editReply({ embeds: [MinimalEmbed('Hierarchy Conflict', 'The target role is higher than or equal to my highest role system position.')] });
                }

                try {
                    const updateData = { color: hexColor };
                    // Role Icon feature requires Tier 2 Server Boost level on Discord natively
                    if (iconUrl) updateData.icon = iconUrl; 

                    await targetRole.edit(updateData);
                    return i.editReply({ embeds: [MinimalEmbed('Role Adjusted Successfully', `Modified **${targetRole.name}** metadata.\n• **New Color:** \`${hexColor}\`\n• **Icon Parameter:** ${iconUrl ? 'Updated' : 'Unchanged'}`)] });
                } catch (err) {
                    return i.editReply({ embeds: [MinimalEmbed('Execution Failed', `Could not apply updates. Ensure the Icon URL is correct and server boost parameters allow custom role icons.`)] });
                }

            // 👑 NEW: ROLE CREATE LOGIC
            case 'role_create':
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return i.editReply({ embeds: [MinimalEmbed('Access Denied', 'You require `Manage Roles` permission parameters to execute this.')] });

                const roleName = i.options.getString('name');
                const displaySeparately = i.options.getBoolean('display');

                try {
                    const newRole = await i.guild.roles.create({
                        name: roleName,
                        hoist: displaySeparately,
                        reason: `Forged via Hivemind system by ${i.user.tag}`
                    });
                    return i.editReply({ embeds: [MinimalEmbed('Role Forged Successfully', `A new transmission matrix has been built:\n• **Role:** ${newRole}\n• **Separated Display:** \`${displaySeparately}\``)] });
                } catch (err) {
                    return i.editReply({ embeds: [MinimalEmbed('Creation Failed', 'Failed to forge the role. Ensure my system permissions cover `Manage Roles`.')] });
                }

            // ==========================================
            // 🚨 HIVEMIND GLOBAL PROTOCOLS (OMEGA SHIELD)
            // ==========================================
            case 'hivemind_nuke':
                if (i.user.id !== DEV_ID) return i.editReply({ embeds: [MinimalEmbed('AUTHORIZATION FAILED', 'Only Developer Vasudev Roy can initiate Protocol OMEGA.')] });
                
                const culprit = i.options.getUser('target');
                const dangerEmbed = MinimalEmbed('🚨 PROTOCOL OMEGA: GLOBAL LOCKDOWN 🚨')
                    .setColor('#FF0000')
                    .setDescription(`**CRITICAL THREAT DETECTED.**\nEntity <@${culprit.id}> (\`${culprit.id}\`) has triggered a security alert.\n\n**Automated Containment Measures:**\n1. Global Hive Network Ban Implemented.\n2. All connected guild communication pathways closed.\n\n*Awaiting Master Override key from Vasudev Roy.*`);

                await i.editReply({ embeds: [MinimalEmbed('Executing Protocol OMEGA', 'Broadcasting containment fields globally...')] });

                client.guilds.cache.forEach(async guild => {
                    try {
                        await guild.members.ban(culprit.id, { reason: 'HIVEMIND GLOBAL THREAT SYSTEM DETECTED' }).catch(()=>{});
                        await guild.roles.everyone.setPermissions(guild.roles.everyone.permissions.remove(PermissionsBitField.Flags.SendMessages)).catch(()=>{});
                        const sysChannel = guild.systemChannel || guild.channels.cache.find(c => c.isTextBased() && c.permissionsFor(guild.members.me).has('SendMessages'));
                        if (sysChannel) sysChannel.send({ embeds: [dangerEmbed] });
                    } catch (e) {}
                });
                break;

            case 'hivemind_restore':
                if (i.user.id !== DEV_ID) return i.editReply({ embeds: [MinimalEmbed('AUTHORIZATION FAILED', 'Only Developer Vasudev Roy can reset system parameters.')] });

                const safeEmbed = MinimalEmbed('✅ HIVEMIND: NETWORK ARCHITECTURE RESTORED')
                    .setColor('#00FF99')
                    .setDescription('**ALL SECTORS SECURED.**\nDeveloper Vasudev Roy has authorized full global decryption. Communication pathways reopened.');

                await i.editReply({ embeds: [MinimalEmbed('Deploying Global Safe Keys', 'Releasing transmission locks...')] });

                client.guilds.cache.forEach(async guild => {
                    try {
                        await guild.roles.everyone.setPermissions(guild.roles.everyone.permissions.add(PermissionsBitField.Flags.SendMessages)).catch(()=>{});
                        const sysChannel = guild.systemChannel || guild.channels.cache.find(c => c.isTextBased() && c.permissionsFor(guild.members.me).has('SendMessages'));
                        if (sysChannel) sysChannel.send({ embeds: [safeEmbed] });
                    } catch (e) {}
                });
                break;

            default:
                return i.editReply({ content: 'Protocol synchronization active.' });
        }
    } catch (e) {
        console.error(e);
        if (i.deferred) await i.editReply({ embeds: [MinimalEmbed('System Error', 'Internal execution pipeline failed.')] }).catch(()=>{});
    }
});

client.login(process.env.DISCORD_TOKEN);
