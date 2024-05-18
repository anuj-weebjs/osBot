var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var getUserById = require('../../../utils/getUserByRawMessage');

var prefix = config.PREFIX;

module.exports = {
    execute: async (message: any) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        if (args.length != 1 && args.length < 1) {
            message.reply(`INVAILD ARGS! use \`${prefix} shoot <arg>\``);
            return;
        }

        const mentionedUser = await getUserById(message.mentions.users.first().toString());

        send(message, 'handshake', `${message.author.globalName} and ${mentionedUser.globalName} clasp hands in a firm handshake, sealing their agreement with mutual respect`);

    }
}
