const afkModel = require('../../../model/afkSchema');
const config = require('../../../config.json');
const database = require('../../../database.js');

const prefix = config.PREFIX;

module.exports = {
    execute: async (message) => {

        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();
        if (args.length != 1 && args.length < 1) {
            message.reply(`INVAILD ARGS! use \`${prefix} afk [on/off] [reason]\``);
            return;
        }   
        const userid = message.author.id;
        

        const a = message.createdTimestamp;
        const timeStamp = (a / 1000) | 0;

        if (args[0].toLowerCase() == "on") {
            args.shift();
            if(args.length == 0){
                var reason = "none"
            }else {
                var reason = args.join(" ");
            }
            await database.main.deleteAfkData(userid);
            await database.main.writeAfkData(userid, reason, timeStamp);

            message.reply(`AFK Status is Now \`On!\` reason: ${reason}, Time: <t:${timeStamp}>`);
        } else if(args[0].toLowerCase() == "off"){
            await database.main.deleteAfkData(userid);
            message.reply(`AFK Status is Now \`Off!\``);
        }

    }
}