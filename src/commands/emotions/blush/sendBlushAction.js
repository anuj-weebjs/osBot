const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'blush', `${message.author.globalName}'s cheeks turned a rosy hue, a clear sign of the blush that spread across their face`);
    },

};