var send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message: any)=>{
        send(message, 'cry', `Tears streamed down ${message.author.globalName} face as they sobbed, their heartache evident in the quivering of their lips`);
    },
};