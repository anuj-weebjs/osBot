const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'sleep', `${message.author.globalName} Needs some Sleep. ZzZ~`);
    },

};