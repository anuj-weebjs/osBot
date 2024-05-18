var send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message:any)=>{
        send(message, 'sleep', `${message.author.globalName} Needs some Sleep. ZzZ~`);
    },

};