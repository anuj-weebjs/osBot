import { Message } from "discord.js";

var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var getUserById = require('../../../utils/getUserByRawMessage');

var prefix = config.PREFIX;

export const structure = {
    name: "highfive",
    description: "Share HighFive With Someone!",
    usage: `${prefix}highfive <mention>`
}

export const execute = async (message: Message) => {
    const args = await message.content.slice(prefix.length).trim().split(/ +/);
    args.shift();
    let mentionedUser = message.mentions.users.first();

    if (args.length != 1 && args.length < 1 || !mentionedUser) {
        message.reply(`INVAILD OPTIONS! use \`${prefix}highfive @user\``);
        return;
    }


    send(message, 'highfive', `${message.author.globalName} & ${mentionedUser.globalName} are sharing a High Five`);

}
