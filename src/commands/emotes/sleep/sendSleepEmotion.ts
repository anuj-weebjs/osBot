var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
module.exports = {
    structure: {
        name: "sleep",
        description: "Sends a Gif category: sleep",
        usage: `${prefix} sleep`
    },
    execute: async(message:any)=>{
        send(message, 'sleep', `${message.author.globalName} Needs some Sleep. ZzZ~`);
    },

};