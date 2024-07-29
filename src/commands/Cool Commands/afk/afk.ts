import { Message } from "discord.js";

var afkDoc = require('../../../model/afkModel.js');
var config = require('../../../../config.json')
var prefix = config.PREFIX;

module.exports = {
    structure: {
        name: "afk",
        description: "You can your status To Afk. So when someone pings you or replies to your message They will get notified That you are afk with the reason that You've Provided",
        usage: `${prefix}afk <reason>`
    },
    execute: async (message: Message) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        const userid = message.author.id;
        var _reason: string;
        args.shift();
        if (args.length == 0) {
            _reason = "none"
        } else {
            _reason = args.join(" ");
        }

        if(_reason.length > 220){
            message.channel.send(`The Length of Reason Must be less than 220 letters(including spaces)`)
            return;
        }

        const a = message.createdTimestamp;
        const timeStamp = (a / 1000) | 0;

        try {
            await afkDoc.deleteMany({ userId: userid });
            const newDoc = new afkDoc({ userId: userid, reason: _reason, afkStartTime: timeStamp });
            await newDoc.save();
        } catch (err) {
            console.log("Error in afk.js " + err);
            message.channel.send("[500] Internal Server Error");
            return;
        }

        if (args.length < 1) {
            message.reply(`AFK Status is Now \`On!\` reason: ${_reason}, Time: <t:${timeStamp}:R>. Btw You can provide a reason by doing \`${prefix}afk <reason>\``);
        } else {
            message.reply(`AFK Status is Now \`On!\` reason: ${_reason}, Time: <t:${timeStamp}:R>`);
        }
    }


}