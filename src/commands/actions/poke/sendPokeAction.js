const config = require('../../../config.json');
const send = require('../../../utils/sendActionEmbed');

let prefix = config.PREFIX; 

module.exports = {
    execute: async (message) => {
        const args = await message.content.slice(2).trim().split(/ +/);
        args.shift();
        if (args.length != 1 && args.length < 1) {
            message.reply(`INVAILD ARGS! use \`${prefix} poke <arg>\``);
            return;
        }
        const mentionedUser = message.mentions.users.first();

        send(message, 'poke', `Aww... ${message.author.globalName} is Pokeing ${mentionedUser}`)

    }
}