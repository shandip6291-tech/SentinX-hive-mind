const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

// --- PREDATOR SETTINGS ---
const FORBIDDEN_WORDS = ["scam", "spamlink", "badword1"];

client.on('ready', () => {
    console.log(`SentinX [Apex Predator] is live: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // 1. SOFT DIPLOMACY (Warning Logic)
    if (message.content.includes("warning-trigger")) {
        const warning = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('SentinX | Diplomatic Warning')
            .setDescription('Please refrain from inappropriate activity. This is your only warning.');
        return message.reply({ embeds: [warning] });
    }

    // 2. APEX PREDATOR (Security Logic)
    if (FORBIDDEN_WORDS.some(word => message.content.toLowerCase().includes(word))) {
        await message.delete();
        const alert = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('SentinX | Security Breach')
            .setDescription(`Detected prohibited content from ${message.author.username}. Action: Quarantined.`);
        return message.channel.send({ embeds: [alert] });
    }
});

client.login(process.env.DISCORD_TOKEN);
