import { Message } from "discord.js";

var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var getUserById = require('../../../utils/getUserByRawMessage');

var prefix = config.PREFIX;

export const
    structure = {
        name: "shoot",
        description: "shoot Someone😨",
        usage: `${prefix}shoot @user`
    },
    execute = async (message: Message) => {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        let mentionedUser = message.mentions.users.first();

        if (args.length != 1 && args.length < 1 || !mentionedUser || mentionedUser === null) {
            message.reply(`INVAILD OPTIONS! use \`${prefix}shoot @user\``);
            return;
        }

        send(message, 'shoot', `${message.author.globalName} Has pulled up Trigger! on ${mentionedUser.globalName}`)

    }


