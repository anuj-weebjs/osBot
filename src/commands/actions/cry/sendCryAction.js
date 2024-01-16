const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'cry', `Nooo ${message.author.globalName} is Crying! Somebody should help him.`);
    },
};