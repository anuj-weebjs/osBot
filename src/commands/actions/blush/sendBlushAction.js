const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'blush', `\`${message.author.username} is Blushing \``);
    },

};