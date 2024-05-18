var send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message:any)=>{
        send(message, 'think', `${message.author.globalName} is lost in thought`);
    },

};