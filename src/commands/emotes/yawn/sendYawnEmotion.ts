var send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message:any)=>{
        send(message, 'yawn', `${message.author.globalName} is caught in a yawn`);
    },
};