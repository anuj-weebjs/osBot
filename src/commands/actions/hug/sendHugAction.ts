var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var getUserById = require('../../../utils/getUserByRawMessage');

var prefix = config.PREFIX;

module.exports = {
    structure:{
        name: "hug",
        description: "Hug Someone 🤗",
        usage: `${prefix} hug <mention>`
    },
    execute: async (message: any) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        if (args.length != 1 && args.length < 1) {
            message.reply(`INVAILD ARGS! use \`${prefix} poke <arg>\``);
            return;
        }

        const mentionedUser = await getUserById(message.mentions.users.first().toString());

        send(message, 'hug', `${message.author.globalName} envelops ${mentionedUser.globalName} in a warm embrace, their connection palpable in the tightness of the hug`);

    }
}