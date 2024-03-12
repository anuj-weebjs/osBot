const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'nope', `${message.author.globalName}'s opinion on the matter is "nope"`);
    },
};