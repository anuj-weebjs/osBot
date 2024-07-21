var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var getUserById = require('../../../utils/getUserByRawMessage');

var prefix = config.PREFIX;

module.exports = {
    structure:{
        name: "shoot",
        description: "shoot Someone😨",
        usage: `${prefix}shoot <mention>`
    },
    execute: async (message: any) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        let mentionedUser = message.mentions.users.first();

        if (args.length != 1 && args.length < 1 || !mentionedUser) {
            message.reply(`INVAILD OPTIONS! use \`${prefix} shoot <arg>\``);
            return;
        }


        send(message, 'shoot', `${message.author.globalName} Has pulled up Trigger! on ${mentionedUser.globalName}`)

    }
}

