import { Message } from "discord.js";

var {PREFIX} = require('../../../../config.json');
module.exports = {
    structure: {
        name: "invite",
        Description: "Send's Bot Invite Links",
        usage:`${PREFIX} invite`
    },
    execute: async(message: Message)=>{
        message.channel.send(`https://discord.com/oauth2/authorize?client_id=1227972298653302826`);
    }
} 