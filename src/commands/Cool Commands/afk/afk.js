const config = require('../../../config.json');
const afkModel = require('../../../model/afkModel.js');

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
            if (args.length == 0) {
                var _reason = "none"
            } else {
                var _reason = args.join(" ");
            }
            try {
                await afkModel.deleteMany({ userId: userid });
                const newDoc = new afkModel({ userId: userid, reason: _reason, afkStartTime: timeStamp });
                await newDoc.save();
            } catch (err) {
                console.log("Error in afk.js " + err);
                message.channel.send("[500] Internal Server Error");
                return;
            }
            if (args.length < 1) {
                message.reply(`AFK Status is Now \`On!\` reason: ${_reason}, Time: <t:${timeStamp}:R>. Btw You can also do \`${prefix} afk on <reason>\``);
            } else {
                message.reply(`AFK Status is Now \`On!\` reason: ${_reason}, Time: <t:${timeStamp}:R>`);
            }
        } else if (args[0].toLowerCase() == "off") {
            await afkModel.deleteMany({ userId: userid });
            message.reply(`AFK Status is Now \`Off!\``);
        }

    }
}