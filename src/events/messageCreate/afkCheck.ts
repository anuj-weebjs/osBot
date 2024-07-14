var afkDoc = require('../../model/afkModel');
var getUserById = require('../../utils/getUserById');
var {EmbedBuilder} = require('discord.js')

module.exports = {
    execute: async (message: any) => {

        if (!message) return;
        if (message.author.bot) return;

        afkCheckOnMentionMessage(message);
        afkCheckOnEveryMessage(message);
        afkCheckOnRepliedMessage(message);
        return;
    }
}

async function afkCheckOnEveryMessage(message: typeof Message) {
    if (!message) return;
    if (message.author.bot) return;
    const userid = message.author.id;
    var queryResult = await afkDoc.findOne({ userId: userid });

    if (queryResult == null) return;
    if (queryResult.userId == userid) {
        const Embed = new EmbedBuilder();
        Embed.setColor('#ADD8E6');
        Embed.setAuthor({ name: `Welcome Back ${message.author.globalName}` });
        if (queryResult.pingedBy.length == 0) {
            Embed.setDescription(`You Were AFK From <t:${queryResult.afkStartTime}:R>`)
        } else {
            Embed.setDescription(`You Were AFK From <t:${queryResult.afkStartTime}:R> & you've Pinged ${queryResult.pingedBy.length} Times`);
            for (let i = 0; i < queryResult.pingedBy.length; i++) {
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
    return;
}

async function afkCheckOnMentionMessage(message: typeof Message) {
    if (!message) return;
    if (message.author.bot) return;
    const messageString = message.content;

    const regex = /<@(\d+)>/g;
    let userIds: string[] = [];
    let match;

    while ((match = regex.exec(messageString)) !== null) {
        userIds.push(match[1]);
    }

    if (userIds.length == 0) return;

    for (let userid of userIds) {
        try {
            var queryResult = await afkDoc.findOne({ userId: userid });
            if (!queryResult) {
                throw new Error("There was an Error while retreving data from database")
            }
        } catch (err) {
            continue;
        }
        if (queryResult == null) return;

        if (queryResult.length < 1) continue;
        if (!queryResult.userId) continue;


        const reason = queryResult.reason;


        if (queryResult.userId == userid) {
            const userData = await getUserById(userid);
            if (queryResult.reason == 'none') {
                message.reply(`${userData.globalName} Went \`AFK\` <t:${queryResult.afkStartTime}:R>`);
            } else {
                message.reply(`${userData.globalName} Went \`AFK\` <t:${queryResult.afkStartTime}:R> Reason: ${reason}`);
            }

            if (queryResult?.pingedBy.length > 5) {
                continue;
            }

            const rawCurrentTimeStamp: number = message.createdTimestamp;
            const currentTimeStamp: number = (rawCurrentTimeStamp / 1000) | 0;


            await afkDoc.findOneAndUpdate({ userId: userid }, {
                $push: {
                    pingedBy: {
                        username: message.author.username,
                        channelId: message.channel.id,
                        messageId: message.id,
                        timestamp: currentTimeStamp,
                    }
                }
            })
        } else {
            continue;
        }
    }
    return;
}


async function afkCheckOnRepliedMessage(message: typeof Message) {
    if (!message) return;
    if (message.author.bot) return;
    if (message.reference != null) {
        const msg = await message.channel.messages.fetch(message.reference.messageId)
        try {
            var queryResult = await afkDoc.findOne({ userId: msg.author.id });
        } catch (err) {
            console.log(err);
        }


        if (queryResult == null) return;
        if (queryResult.reason) {
            if (queryResult.length < 1) return;

            const reason = queryResult.reason;
            if (message.author.id == queryResult.userId) return;
            if (queryResult.userId == msg.author.id) {
                if (queryResult.reason == 'none') {
                    message.reply(`He/She Went AFK <t:${queryResult.afkStartTime}:R>`);
                } else {
                    message.reply(`He/She Went AFK <t:${queryResult.afkStartTime}:R> Reason: ${reason}`);
                }
            } else {
                return;
            }
        }
    }
    return;
}