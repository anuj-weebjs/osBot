var config = require('../../../../config.json');
var developerId = config.developerId;
module.exports = {
    execute: async(message: typeof Message)=>{
        if(message.author.id == developerId){
            await message.channel.send("Shutting down");
            process.exit(1);
        }else{
            return;
        }
    },

};