var send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message:any)=>{
        send(message, 'happy', `${message.author.globalName}’s face lit up with a radiant smile, their eyes sparkling with the unmistakable glow of happiness`);
    },
};