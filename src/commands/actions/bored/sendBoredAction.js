const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'bored', `${message.author.globalName} is Bored af`);
    },
};