const { Client, GatewayIntentBits, Collection, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.json');


// KEEP ALIVE

const app = express();
app.get("/", (req, res) => {
    res.status(200).send({
        success: "true"
    });
});
app.listen(3010);

// BOT

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})


const eventsPath = path.join(__dirname, 'events');
const eventsFolders = fs.readdirSync(eventsPath);


for (let eventFolder of eventsFolders) {
    let eventFolderPath = path.join(eventsPath, eventFolder);
    let eventFiles = fs.readdirSync(eventFolderPath);
    for (let eventFile of eventFiles) {
        let eventFilePath = path.join(eventFolderPath, eventFile);
        const eventName = path.basename(eventFolderPath);
        const event = require(eventFilePath);
        console.log(event)
        if (event.once) {
            client.once(eventName, (...args) => event.execute(...args));
        } else {
            client.on(eventName, (...args) => event.execute(...args, client));
            // console.log('event.on')
        }
    }
}

client.login(config.token);