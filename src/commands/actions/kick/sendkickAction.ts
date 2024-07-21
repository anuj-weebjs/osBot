var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var getUserById = require('../../../utils/getUserByRawMessage');

var prefix = config.PREFIX;

module.exports = {
    structure:{
        name: "kick",
        description: "Kick Someone 🦵",
        usage: `${prefix}kick <mention>`
    },
    execute: async (message: any) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        if (args.length != 1 && args.length < 1) {
            message.reply(`INVAILD ARGS! use \`${prefix} poke <arg>\``);
            return;
        }

        const mentionedUser = await getUserById(message.mentions.users.first().toString());

        send(message, 'kick', `${message.author.globalName}'s foot meets ${mentionedUser.globalName}'s side with a thud - a kick in the heat of the moment`);

    }
}