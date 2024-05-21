var miscDoc = require('../../model/miscmodel');
var config = require('../../../config.json');
var developerId = config.developerId;
var prefix = config.PREFIX;

module.exports = {
    execute: async (message: any, client: any) => {
        if (!message) return;
        var args = message.content.slice(prefix.length).trim().split(/ +/);
        const msgCommand = args.shift().toLowerCase();

        if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

        if (!message.channel.permissionsFor(client.user.id).has("SendMessages")) { //You can do the same for EmbedLinks, ReadMessageHistory and so on
            return;
        };

        var messageUserId = message.author.id;
        let userData = await miscDoc.findOne({ userId: messageUserId });

        if (!userData) {
            if (msgCommand != 'start') {
                await message.channel.send({
                    files: [
                        {
                            attachment: 'TOS.md',
                            name: 'TOS.md'
                        }
                    ],
                    content: `In order to use the Bot you have to Accept TOS By Typing \`${prefix} start\``
                });
                return;
            }
        }

        const rawCurrentTimeStamp: number = message.createdTimestamp;
        const currentTimeStamp: number = (rawCurrentTimeStamp / 1000) | 0;

        if (msgCommand != 'start') {
            const rawUsedCommandTime = userData.lastUsedCommandTime;
            const usedCommandTime = parseInt(rawUsedCommandTime);

            if (currentTimeStamp < (usedCommandTime + 5)) {
                message.channel.send(`Cooldown!!! I'm Hosted on free tier Hosting Cause My Developer Cant afford a vps So, Wait <t:${usedCommandTime + 5}:R>`);
                return;
            }
        }


        const { commands } = client;
        const command = commands.get(msgCommand);
        if (!command) return;
        try {
            await command.execute(message, client, args,)
        } catch (err: any) {
            let channel = await client.channels.cache.get(config.log.errorChannelId);
            channel.send(`
            Error: ${err.toString()}\n
            raw Message: ${message.content}\n
            Command: ${msgCommand}\n
            Guild: ${message.guild.name} | ${message.guild.id}\n
            User: ${message.author.username} | ${message.author.id}
            `);
            console.log(err);
            
            message.channel.send(`There was an error while executing \`${msgCommand}\` command. Data has Been Sent to Devlopers! The issue will be fixed soon`);
        } finally {
            let channel = await client.channels.cache.get(config.log.executeChannelId);
            channel.send(`-----------------\nraw Message: ${message.content}\nCommand Name: ${msgCommand}\nGuild: ${message.guild.name} | ${message.guild.id}\nUser: ${message.author.username} | ${message.author.id}`);

            if (msgCommand != 'start') {
                userData.lastUsedCommand = msgCommand;
                userData.lastUsedCommandTime = currentTimeStamp;
                await userData.save();
            }
        }
    }
}
