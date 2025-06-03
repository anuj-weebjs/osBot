import { Message } from "discord.js";
import { errorLog } from "../../../utils/sendLog";

var config = require('../../../../config.json');
var developerId = config.developerId;
module.exports = {
    structure:{
        name:"test",
        description: "only Developer can use this",
        usage:".."
    },
    execute: async(message: Message)=>{

        if(message.author.id == developerId){
           
        console.log(message.reference)


        }else{
            if(!message.channel.isSendable()) return;

            message.channel.send('only developer can use this command')
        };


        // Testing for Developer
        
        // message.channel.send(`${message.channel.nsfw}`);
    },

};