var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
module.exports = {
    structure: {
        name: "happy",
        description: "Sends a Gif category: happy",
        usage: `${prefix}happy`
    },
    execute: async(message:any)=>{
        send(message, 'happy', `${message.author.globalName}’s face lit up with a radiant smile, their eyes sparkling with the unmistakable glow of happiness`);
    },
};