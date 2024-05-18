var send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message:any)=>{
        send(message, 'nope', `${message.author.globalName}'s opinion on the matter is "nope"`);
    },
};