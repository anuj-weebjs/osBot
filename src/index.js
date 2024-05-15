const path = require('node:path');
const fs = require('node:fs');
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const port = process.env.PORT || 4000;
const database = require('./database.js')
require('dotenv').config();
const token = process.env.TOKEN;
const mongoDbConnectionString = process.env.MONGO_DB_CONNECTION_STRING;

async function connectdb() {
    await database.main.connect(mongoDbConnectionString);
    return 0;
}
connectdb();
// KEEP ALIVE

const app = express();
app.get("/", (req, res) => {
    res.status(200).send({
        success: "true"
    });
});
app.listen(port);

// BOT

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ]
})

exports.client = client;

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
        try{

            if (event.once) {
                client.once(eventName, (...args) => event.execute(...args));
            } else {
                client.on(eventName, (...args) => event.execute(...args, client));
            }
        }catch(err){
            client.users.fetch('808318773257437216', false).then((user) => {
                user.send(err.toString());
               });
            console.log(err)
        }
    }
}

client.login(process.env.TOKEN);

// module.exports = {
//     DB: db,
//     CLIENT: client
// }

