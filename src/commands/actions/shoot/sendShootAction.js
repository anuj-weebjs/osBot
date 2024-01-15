const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        const args = await message.content.slice(2).trim().split(/ +/);
        args.shift();
        if(args.length != 1 && args.length > 1){
            message.reply(`INVAILD ARGS! use \`os shoot <arg>\``);
            return;
        }
        send(message, 'shoot', `\`${message.author.username} Has pulled up Trigger! against ${args}\``)

    }
}