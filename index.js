const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// --- RED NEON "APEX" DASHBOARD (HTML + CSS) ---
const getDashboardHTML = (ping) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SentinX | Apex Predator</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body {
            background-color: #050505; color: #ffffff;
            background-image: radial-gradient(circle at 70% 30%, rgba(255, 0, 51, 0.15), transparent 50%),
                              radial-gradient(circle at 20% 80%, rgba(200, 0, 0, 0.05), transparent 40%);
            min-height: 100vh; overflow-x: hidden; padding: 2rem;
        }
        /* Navbar */
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 3rem; }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; display: flex; align-items: center; gap: 10px; }
        .logo span { color: #ff0033; }
        .status-badge { background: rgba(255, 0, 51, 0.1); color: #ff0033; padding: 5px 15px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; border: 1px solid rgba(255, 0, 51, 0.3); }

        /* Hero Section */
        .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-bottom: 4rem; }
        .hero-text h1 { font-size: 4.5rem; font-weight: 900; line-height: 1; letter-spacing: -2px; margin-bottom: 1.5rem; }
        .hero-text h1 .highlight { color: #ff0033; display: block; }
        .hero-text p { color: #888; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; max-width: 90%; }
        
        .btn { background: #ff0033; color: white; border: none; padding: 15px 30px; border-radius: 50px; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 0 20px rgba(255,
