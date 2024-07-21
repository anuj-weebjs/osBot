var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
module.exports = {
    structure: {
        name: "laugh",
        description: "Sends a Gif category: laugh",
        usage: `${prefix}laugh`
    },
    execute: async(message:any)=>{
        send(message, 'laugh', `${message.author.globalName}'s laughter fills the room, a melody of joy that dances in the air`);
    },
};