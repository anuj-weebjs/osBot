var config = require('../../../../config.json');
var developerId = config.developerId;
module.exports = {
    structure:{
        name:"kill",
        description: "only Developer can use this",
        usage:".."
    },
    execute: async(message: typeof Message, client: typeof Client)=>{

        if(message.author.id == developerId){
            await message.channel.send("Shutting down");
            client.destroy();
        }else{
            return;
        }
    },

};