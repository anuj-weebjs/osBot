const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'think', `${message.author.globalName} is lost in thought`);
    },

};