const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'bored', `${message.author.globalName} yawned and stared blankly, their eyes glazing over from the sheer monotony of the moment`);
    },
};