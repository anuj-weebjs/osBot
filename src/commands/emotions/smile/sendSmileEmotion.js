const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'smile', `${message.author.globalName}'s smile Lights up the room`);
    },

};