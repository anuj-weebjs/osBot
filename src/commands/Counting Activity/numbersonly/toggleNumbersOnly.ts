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

        oldDoc.numbersOnly = !oldDoc.numbersOnly;
        message.channel.send(`Numbers Only Is now ${oldDoc.numbersOnly ? 'Enabled' : 'Disabled'}`);
        message.channel.send(oldDoc.numbersOnly.toString());
        await oldDoc.save();
        return;
    }
}