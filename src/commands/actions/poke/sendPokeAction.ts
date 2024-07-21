var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var getUserById = require('../../../utils/getUserByRawMessage');

var prefix = config.PREFIX;

module.exports = {
    structure:{
        name: "poke",
        description: "poke Someone",
        usage: `${prefix} poke <mention>`
    },
    execute: async (message: any) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        if (args.length != 1 && args.length < 1) {
            sendInvaildMsg(message);
            return;
        }

        const mentionedUser = await getUserById(message.mentions.users.first().toString());
        if(!mentionedUser){
            sendInvaildMsg(message);
            return;
        }

        send(message, 'poke', `Aww... ${message.author.globalName} is Pokeing ${mentionedUser.globalName}`)

    }
}

async function sendInvaildMsg(message: typeof  Message){
    message.reply(`INVAILD ARGS! use \`${prefix} shoot @mention\``);
}