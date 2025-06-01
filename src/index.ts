import { Connection } from "mongoose";
import { Client, GatewayIntentBits, Collection, EmbedBuilder} from 'discord.js';

// Imports
require('dotenv').config();
var path = require('node:path');
var fs = require('node:fs');
const express = require('express');
var mongoose = require('mongoose');
var config = require('./../config.json');

// Defining Variables
var client: any = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ]
});

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

var db = connect(dbConnectionString);

async function connect(connectionString: string | undefined): Promise<Connection> {
    try {
        var connection = await mongoose.connect(connectionString);
    } catch (err) {
        console.log("Failed to connect Database " + err);
        process.exit(1);
    }


    console.log("Connected to DataBase");
    return connection;
}
exports.db = db;

// Handeling
const handlersPath = path.join(__dirname, 'handler');
const handlers = fs.readdirSync(handlersPath);

for (const handler of handlers) {
    require(path.join(handlersPath, handler))(client);
}

client.handleEvents(client); 
client.login(token);


let channel;     

process.on('uncaughtException', async function (err, ori) {
    console.error(err);

    channel = await client.channels.cache.get(config.log.uncaughtExceptionChannelId);
    if (!channel) {
        channel = await client.channels.cache.get(config.log.uncaughtExceptionChannelId);
        if (!channel) {
            return;
        }
    }

    const logEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`Cause: ${err.cause?.toString()}\nName: ${err.name.toString()}\nStack: ${err.stack?.toString()}`);

    channel?.send({embeds: [logEmbed]});
});
