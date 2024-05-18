var send = require('../../../utils/sendActionEmbed');

module.exports = {
    execute: async(message:any)=>{
        send(message, 'laugh', `${message.author.globalName}'s laughter fills the room, a melody of joy that dances in the air`);
    },
};