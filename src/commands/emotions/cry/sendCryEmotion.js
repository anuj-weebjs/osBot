const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'cry', `Tears streamed down ${message.author.globalName} face as they sobbed, their heartache evident in the quivering of their lips`);
    },
};