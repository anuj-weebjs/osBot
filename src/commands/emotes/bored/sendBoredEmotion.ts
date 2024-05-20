var send = require('../../../utils/sendActionEmbed');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
module.exports = {
    structure:{
        name: "bored",
        description: "Sends a Gif category: bored",
        usage: `${prefix} bored`
    },
    execute: async(message:any)=>{
        send(message, 'bored', `${message.author.globalName} yawned and stared blankly, their eyes glazing over from the sheer monotony of the moment`);
    },
};