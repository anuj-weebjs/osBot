import { Message, EmbedBuilder, TimestampStyles } from "discord.js";

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
            let embed: EmbedBuilder = new EmbedBuilder()
            .setColor(config.embedColor.alert)
            .setDescription(`The Length of Reason Must be less than 220 letters(including spaces)`)
            .setTimestamp();
            message.reply({embeds:[embed]});
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
            let embed: EmbedBuilder = new EmbedBuilder()
            .setColor(config.embedColor.alert)
            .setDescription(`[500] Internal Server Error`)
            .setTimestamp();
            message.channel.send({embeds: [embed]});
            return;
        }

        let embed: EmbedBuilder = new EmbedBuilder();
        embed.setColor(config.embedColor.primary);
        let name: string | null
        if(message.author.globalName){
            name = message.author.globalName;
        }else{
            name = message.author.username;
        }
        embed.setAuthor({name: name, iconURL: `${message.author.avatarURL()}`});
        if (args.length < 1) {
            embed.setTitle(`Enabled AFK Status!`);
            embed.setDescription(`You can also provide a reason by doing \`${prefix}afk <reason>\``)
        } else {
            embed.setTitle(`Enabled AFK Status!`);
            embed.setDescription(`Reason: ${_reason}`)
        }
        embed.setTimestamp();
        message.channel.send({embeds: [embed]});
        return;
    }


}