var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
module.exports = {
    structure: {
        name: "dance",
        description: "Sends a Gif category: dance",
        usage: `${prefix}dance`
    },
    execute: async(message:any)=>{
        send(message, 'nope', `${message.author.globalName}'s opinion on the matter is "nope"`);
    },
};