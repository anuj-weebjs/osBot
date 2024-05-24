var { EmbedBuilder } = require('discord.js');
var afkDoc = require('../../model/afkModel');
var { PREFIX } = require('../../../config.json')
module.exports = {
    execute: async (message: any) => {
        if (message.author.bot) return;

        const args = await message.content.slice(PREFIX.length).trim().split(/ +/);

        if (args[0].toLowerCase() === 'afk') return;

        const userid = message.author.id;
        var queryResult = await afkDoc.findOne({ userId: userid });
        console.log(queryResult);

        if (queryResult == null) return;
        if (queryResult.userId == userid) {

            const Embed = new EmbedBuilder();
            Embed.setColor('#ADD8E6');
            Embed.setAuthor({ name: `Welcome Back ${message.author.globalName}` });
            if(queryResult.pingedBy.length == 0){
                Embed.setDescription(`You Were AFK From <t:${queryResult.afkStartTime}:R>`)
            }else{
                Embed.setDescription(`You Were AFK From <t:${queryResult.afkStartTime}:R> & you've Pinged ${queryResult.pingedBy.length} Times`);
                for(let i = 0; i < queryResult.pingedBy.length; i++){
                    Embed.addFields({
                        name: `By @${queryResult.pingedBy[i].username}`,
                        value: `[Click Here](https://discord.com/channels/@me/${queryResult.pingedBy[i].channelId}/${queryResult.pingedBy[i].messageId}) To See Message`,
                        inline: true
                    })
                }
            }

            message.reply({ embeds: [Embed] });
            await afkDoc.deleteMany({ userId: userid });
        }
    }
}