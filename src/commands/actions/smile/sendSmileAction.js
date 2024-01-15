const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'smile', `\`${message.author.username} is Smiling :)\``);
    },

};