import { Connection } from "mongoose";
import { Client as DiscordClient, GatewayIntentBits, Collection, EmbedBuilder, TextChannel, Message } from 'discord.js';

// Imports
import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import mongoose from 'mongoose';
import config from './../config.json';


class ExtendedClient extends DiscordClient {
    commands: Collection<string, Command>;
    handleEvents!: () => Promise<void>;   // To be assigned by eventHandler
    handleCommands!: () => Promise<void>; // To be assigned by commandHandler (via ready event)

    constructor(options: any) {
        super(options);
        this.commands = new Collection();
    }
}

// Defining Variables
const client: _Client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

exports.client = client; // Export for CommonJS modules that might require it

const token = process.env.TOKEN;
const dbConnectionString = process.env.MONGO_DB_CONNECTION_STRING;
const developerId = config.developerId; // Used in some commands, but not directly here.


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
let db: Connection;

async function connectToDatabase(connectionString: string): Promise<Connection> {
    try {
        await mongoose.connect(connectionString);
        console.log("Connected to DataBase");
        return mongoose.connection;
    } catch (err) {
        console.error("Failed to connect to Database:", err);
        process.exit(1);
    }
}

async function main() {
    // Validate essential environment variables
    if (!token) {
        console.error("TOKEN is not defined in environment variables. Please check your .env file or environment configuration.");
        process.exit(1);
    }
    if (!dbConnectionString) {
        console.error("MONGO_DB_CONNECTION_STRING is not defined. Please check your .env file or environment configuration.");
        process.exit(1);
    }

    // Connect to MongoDB
    db = await connectToDatabase(dbConnectionString);
    exports.db = db;

    // Load Handlers (Command, Event)
    const handlersPath = path.join(__dirname, 'handler');
    const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of handlerFiles) {
        try {
            const handlerModule = require(path.join(handlersPath, file));
            if (typeof handlerModule === 'function') {
                handlerModule(client); // Assumes handler exports a function that takes the client
            } else if (handlerModule.default && typeof handlerModule.default === 'function') {
                handlerModule.default(client); // Support for ES module default exports
            } else {
                console.warn(`Handler file ${file} does not export a function or a default function.`);
            }
        } catch (error) {
            console.error(`Error loading handler ${file}:`, error);
        }
    }

    if (typeof client.handleEvents === 'function') {
        await client.handleEvents(); 
    } else {
        console.error("client.handleEvents is not defined. Ensure eventHandler.ts correctly assigns it.");
        process.exit(1);
    }

    await client.login(token);
}

process.on('uncaughtException', async (err: Error, origin: string) => {
    console.error('Uncaught Exception:', err);
    console.error('Origin:', origin);

    if (!client.isReady() || !config.log.uncaughtExceptionChannelId) {
        console.error("Client not ready or logging channel ID not configured for uncaughtException.");
        return;
    }

    try {
        const channel = await client.channels.fetch(config.log.uncaughtExceptionChannelId) as TextChannel | null;
        if (channel && channel.isTextBased()) {
            const logEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Uncaught Exception Occurred")
                .addFields(
                    { name: "Name", value: err.name || "N/A" },
                    { name: "Message", value: err.message || "N/A" },
                    { name: "Origin", value: origin }
                )
                .setTimestamp();

            if (err.cause) {
                logEmbed.addFields({ name: "Cause", value: String(err.cause).substring(0, 1020) });
            }
            if (err.stack) {
                logEmbed.setDescription(`\`\`\`${err.stack.substring(0, 4000)}\`\`\``);
            }
            await channel.send({ embeds: [logEmbed] });
        } else {
            console.error(`Could not find or access channel for uncaughtException: ${config.log.uncaughtExceptionChannelId}`);
        }
    } catch (logError) {
        console.error("Failed to send uncaught exception to Discord:", logError);
    }
});

process.on('unhandledRejection', async (reason: any, promise: Promise<any>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (!client.isReady() || !config.log.uncaughtExceptionChannelId) { // Using same channel for now
        console.error("Client not ready or logging channel ID not configured for unhandledRejection.");
        return;
    }
    try {
        const channel = await client.channels.fetch(config.log.uncaughtExceptionChannelId) as TextChannel | null;
        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle("Unhandled Rejection Occurred")
                .addFields(
                    { name: "Reason", value: String(reason).substring(0, 1020) }
                )
                .setDescription(`Promise details might be available in console logs.`)
                .setTimestamp();
            await channel.send({ embeds: [embed] });
        } else {
            console.error(`Could not find or access channel for unhandledRejection: ${config.log.uncaughtExceptionChannelId}`);
        }
    } catch (logError) {
        console.error("Failed to send unhandledRejection to Discord:", logError);
    }
});

main().catch(error => {
    console.error("Error during bot initialization or runtime:", error);
    process.exit(1);
});
