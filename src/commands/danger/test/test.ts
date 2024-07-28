var config = require('../../../../config.json');
var developerId = config.developerId;
module.exports = {
    structure:{
        name:"test",
        description: "only Developer can use this",
        usage:".."
    },
    execute: async(message: typeof Message, client: typeof Client)=>{

        if(message.author.id != developerId)return;

        message.channel.send(`${message.channel.nsfw}`);
    },

};