var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
module.exports = {
    structure: {
        name: "think",
        description: "Sends a Gif category: think",
        usage: `${prefix} think`
    },
    execute: async(message:any)=>{
        send(message, 'think', `${message.author.globalName} is lost in thought`);
    },

};