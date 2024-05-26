var { Message } = require('discord.js')
var { PREFIX } = require("../../../../config.json");
var countingDoc = require('../../../model/countingModel')

module.exports = {
    structure: {
        name: "counting",
        description: "Start Counting In Current Channel!",
        usage: `${PREFIX} counting enable`
    },
    execute: async (message: typeof Message, client: typeof Client, args: string) => {
        if (!message.member.permissions.has("Administrator")) {
            message.reply(`Only Admins can run this command!`);
            return;
        }
        let option = args[0].toLowerCase();
        let guildId = message.guild.id;
        let channelId = message.channel.id;

        if (option === 'enable') {

            let oldDoc = await countingDoc.findOne({ guildId: guildId });
            if (oldDoc) {
                message.reply(`Counting Is Already enabled In this Channel`);
                return;
            }

            let newDoc = new countingDoc({
                guildId: guildId,
                channelId: channelId,

            });


            message.channel.send(`Enabled Counting Activity In This Server Enjoy!\nNote: NumbersOnly is Enabled! You can toggle it by doing \`${PREFIX} numbersOnly\``);
            await newDoc.save();
            return;
        } else if(option === 'disable'){
            message.channel.send('Disabled Counting Activity In This Server!')
            await countingDoc.deleteMany({guildId: guildId }); 
            return;
        } else{
            message.channel.send(`Invalid Options Use \`${PREFIX} counting enable\` To Enable Counting Activity In This Channel`)
            return;
        }
    }

}