import { Client } from "discord.js";

export {}

declare global {
    interface Command {
        structure: {
            name: string;
            description: string;
            usage: string;
            [key: string]: any;
        };
        execute: (message: Message, client?: ExtendedClient, args?: string[]) => Promise<void> | void;
    }

    interface _Client extends Client {
         commands: Collection<string, Command>;
    handleEvents: () => Promise<void>;   // To be assigned by eventHandler
    handleCommands: () => Promise<void>;
    }

}