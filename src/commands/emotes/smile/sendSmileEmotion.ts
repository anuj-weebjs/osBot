var send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message:any)=>{
        send(message, 'smile', `${message.author.globalName}'s smile Lights up the room`);
    },

};