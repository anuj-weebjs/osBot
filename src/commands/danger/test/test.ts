import { Message } from "discord.js";

var config = require('../../../../config.json');
var developerId = config.developerId;
module.exports = {
    structure:{
        name:"test",
        description: "only Developer can use this",
        usage:".."
    },
    execute: async(message: Message)=>{

        if(message.author.id != developerId)return;


        // Testing for Developer
        
        // message.channel.send(`${message.channel.nsfw}`);
    },

};