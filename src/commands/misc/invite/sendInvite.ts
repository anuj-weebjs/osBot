var { Message, EmbedBuilder } = require("discord.js");

var config = require('../../../../config.json');
var PREFIX = config.PREFIX;
module.exports = {
    structure: {
        name: "invite",
        Description: "Send's Bot Invite Links",
        usage:`${PREFIX}invite`
    },
    execute: async(message: typeof Message)=>{
        let embed = new EmbedBuilder();
        embed.setColor(config.embedColor.primary);
        embed.setDescription(`https://discord.com/oauth2/authorize?client_id=${config.clientId}`)
        message.channel.send({embeds: [embed]});
    }
} 