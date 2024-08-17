import { Message } from "discord.js";
import { sendActionEmbed } from '../../../utils/sendActionEmbed';
// import * as getUserById from '../../../utils/getUserByRawMessage';
// var send = require('../../../utils/sendActionEmbed');

var config = require('../../../../config.json');
var prefix = config.PREFIX;

module.exports = {
    structure: {
        name: "cuddle",
        description: "Cuddle Someone",
        usage: `${prefix}cuddle <mention>`
    },
    execute: async (message: Message) => {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        let mentionedUser = message.mentions.users.first();

        if (args.length != 1 && args.length < 1 || !mentionedUser) {
            message.reply(`INVAILD OPTIONS! use \`${prefix}cuddle @user\``);
            return;
        }

        sendActionEmbed(message, 'cuddle', `${message.author.globalName} nestles into ${mentionedUser.globalName} with a cozy cuddle`);

    }
}