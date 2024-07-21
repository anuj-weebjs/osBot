var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var getUserById = require('../../../utils/getUserByRawMessage');

var prefix = config.PREFIX;

module.exports = {
    structure:{
        name: "hug",
        description: "Hug Someone 🤗",
        usage: `${prefix}hug <mention>`
    },
    execute: async (message: any) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        let mentionedUser = message.mentions.users.first();

        if (args.length != 1 && args.length < 1 || !mentionedUser) {
            message.reply(`INVAILD OPTIONS! use \`${prefix}hug @user\``);
            return;
        }


        send(message, 'hug', `${message.author.globalName} envelops ${mentionedUser.globalName} in a warm embrace, their connection palpable in the tightness of the hug`);

    }
}