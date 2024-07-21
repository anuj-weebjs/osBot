var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
module.exports = {
    structure: {
        name: "smile",
        description: "Sends a Gif category: smile",
        usage: `${prefix}smile`
    },
    execute: async(message:any)=>{
        send(message, 'smile', `${message.author.globalName}'s smile Lights up the room`);
    },

};