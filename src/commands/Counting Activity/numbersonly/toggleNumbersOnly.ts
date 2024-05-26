var { Message } = require('discord.js')
var { PREFIX } = require("../../../../config.json");
var countingDoc = require('../../../model/countingModel')

module.exports = {
    structure: {
        name: "numbersonly",
        description: "Toggle Numbers Only In This Server",
        usage: `${PREFIX} numbersonly`
    },
    execute: async(message: typeof Message) =>{
        let guildId = message.guild.id;
        let oldDoc = await countingDoc.findOne({ guildId: guildId });
        if(oldDoc == null){
            message.channel.send(`Counting Activiy is Not enabled In This server Please Enbale it by doing \`${PREFIX} counting enable\` In Counting Activity Channel`)
            return;
        }

        if(oldDoc.numbersOnly){
            oldDoc.numbersOnly = false;
            await oldDoc.save();
            message.channel.send(`Numbers Only Is Now Disabled!`);
            return;
        }else if (!oldDoc.numbersOnly){
            oldDoc.numbersOnly = true;
            await oldDoc.save();
            message.channel.send(`Numbers Only Is Now Enabled!`);
            return;
        }

    }
}