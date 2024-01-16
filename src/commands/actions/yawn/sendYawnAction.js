const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'yawn', `${message.author.globalName} is Sleepy af`);
    },
};