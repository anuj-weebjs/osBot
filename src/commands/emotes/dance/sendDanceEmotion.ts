import { Message } from "discord.js";

var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
module.exports = {
    structure: {
        name: "dance",
        description: "Sends a Gif category: dance",
        usage: `${prefix}dance`
    },
    execute: async (message: Message) => {
        send(message, 'dance', `${message.author.globalName} twirled and leaped with abandon, their feet moving rhythmically as they lost themselves in the joy of the dance`);
    },
};