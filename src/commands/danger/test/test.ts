import { Message } from "discord.js";
import { errorLog } from "../../../utils/sendLog";
import 'dotenv/config'
let prefix = process.env.PREFIX || "o!";
var config = require('../../../../config.json');
var developerId = process.env.DEV_ID;
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

            message.channel.send('https://tenor.com/view/my-honest-reaction-gif-10673976111485284091');
            message.channel.send('only developer can use this command!')
        };


        // Testing for Developer
        
        // message.channel.send(`${message.channel.nsfw}`);
    },

};