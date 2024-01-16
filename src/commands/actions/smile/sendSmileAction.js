const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'smile', `${message.author.globalName} is Smiling :)`);
    },

};