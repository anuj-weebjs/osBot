var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var getUserById = require('../../../utils/getUserByRawMessage');

var prefix = config.PREFIX;

module.exports = {
    structure:{
        name: "slap",
        description: "Slap Someone When Your Are Angry On Him/Her",
        usage: `${prefix}slap <mention>`
    },
    execute: async (message: any) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        if (args.length != 1 && args.length < 1) {
            message.reply(`INVAILD ARGS! use \`${prefix} shoot <arg>\``);
            return;
        }

        const mentionedUser = await getUserById(message.mentions.users.first().toString());

        send(message, 'slap', `${message.author.globalName}'s hand meets ${mentionedUser.globalName}'s cheek with a sharp slap, a moment of tension between them`);

    }
}

