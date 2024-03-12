const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'dance', `${message.author.globalName} twirled and leaped with abandon, their feet moving rhythmically as they lost themselves in the joy of the dance`);
    },
};