const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const token = process.env.TOKEN;
const mongoDbConnectionString = process.env.MONGO_DB_CONNECTION_STRING;


// CONNECT TO DB

const db = connectDb(process.env.MONGO_DB_CONNECTION_STRING).then(() => console.log("Connected to DataBase")).catch((err) => { console.log("Failed to connect Database") });

async function connectDb(connectionString) {
    const connection = await mongoose.connect(connectionString);
    return connection;
}


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


// Events

const eventsPath = path.join(__dirname, 'events');
const eventsFolders = fs.readdirSync(eventsPath);


for (let eventFolder of eventsFolders) {
    let eventFolderPath = path.join(eventsPath, eventFolder);
    let eventFiles = fs.readdirSync(eventFolderPath);
    for (let eventFile of eventFiles) {
        let eventFilePath = path.join(eventFolderPath, eventFile);
        const eventName = path.basename(eventFolderPath);
        const event = require(eventFilePath);
        if (event.once) {
            client.once(eventName, (...args) => event.execute(...args));
        } else {
            client.on(eventName, (...args) => event.execute(...args, client));
        }
    }
}

client.login(process.env.TOKEN);

module.exports = {
    client,
    db
}