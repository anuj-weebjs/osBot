const send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message)=>{
        send(message, 'dance', `${message.author.globalName} is Dancing Join Him/Her Guys!`);
    },
};