
const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async (message) => {
        const args = await message.content.slice(2).trim().split(/ +/);
        args.shift();
        if (args.length != 1 && args.length > 1) {
            message.reply(`INVAILD ARGS! use \`os poke <arg>\``);
            return;
        }
        const mentionedUser = message.mentions.users.first();

        send(message, 'poke', `\`Aww.. ${message.author.username} is Pokeing ${mentionedUser}\``)

    }
}