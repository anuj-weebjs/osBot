var send = require('../../../utils/sendActionEmbed');
var getUserById = require('../../../utils/getUserByRawMessage');

var config = require('../../../../config.json');
var prefix = config.PREFIX;

module.exports = {
    structure:{
        name: "cuddle",
        description: "Cuddle Someone",
        usage: `${prefix}cuddle <mention>`
    },
    execute: async (message: any) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        if (args.length != 1 && args.length < 1) {
            message.reply(`INVAILD ARGS! use \`${prefix} cuddle mention\``);
            return;
        }

        const mentionedUser = await getUserById(message.mentions.users.first().toString());

        send(message, 'cuddle', `${message.author.globalName} nestles into ${mentionedUser.globalName} with a cozy cuddle`);

    }
}