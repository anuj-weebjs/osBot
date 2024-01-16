const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'happy', `${message.author.globalName} is Happy Today!`);
    },
};