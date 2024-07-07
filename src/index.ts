// Imports
require('dotenv').config();
var path = require('node:path');
var fs = require('node:fs');
var { Client, GatewayIntentBits, Collection, WebhookClient } = require('discord.js');
const express = require('express');
var mongoose = require('mongoose');
var config = require('./../config.json');

// Defining Variables
var client = new Client({
    allowedMentions: { parse: [] },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ]
});
// Exporting Client
exports.client = client;
client.commands = new Collection();

const token = process.env.TOKEN;
const dbConnectionString = process.env.MONGO_DB_CONNECTION_STRING;
var developerId = config.developerId;


// Keep Alive
const app = express();
const port = process.env.PORT || 4010;
app.get('/', (req: any, res: any) => {
    res.send({
        running: true
    });
});
app.listen(port);

// Connecting To Db

connect(dbConnectionString);


async function connect(CONNECTIONSTRING: any) {
    var connection = await connectDb(CONNECTIONSTRING).then(async () => {
        console.log("Connected to DataBase");
    }).catch((err) => {
        console.log("Failed to connect Database " + err);
        process.exit(1);
    });

    async function connectDb(connectionString: any) {
        const connection = await mongoose.connect(connectionString);

        return connection;
    }
}


// Handeling
const handlersPath = path.join(__dirname, 'Handlers');
const handlers = fs.readdirSync(handlersPath);

for (const handler of handlers) {
    require(path.join(handlersPath, handler))(client);
}

client.handleEvents(client);
client.login(token);

let channel;

// process.on('uncaughtException', async function (err, ori) {
//     console.error(err + ori);

//     channel = await client.channels.cache.get(config.log.uncaughtExceptionChannelId);
//     if (!channel) {
//         channel = await client.channels.cache.get(config.log.uncaughtExceptionChannelId);
//         if (!channel) {
//             return;
//         }
//     }

//     channel?.send(`Error: ${err.toString()}\nOrigin: ${ori.toString()}`);
// });
