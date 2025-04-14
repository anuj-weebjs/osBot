import {  EmbedBuilder,  User, TimestampStyles, Message } from "discord.js";

var afkDoc = require('../../model/afkModel');
var getUserById = require('../../utils/getUserById');
var config = require('../../../config.json');

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

async function afkCheckOnEveryMessage(message: any) {
    if (!message) return;
    if (message.author.bot) return;
    const userid = message.author.id;
    var queryResult = await afkDoc.findOne({ userId: userid });

    if (queryResult == null) return;
    if (queryResult.userId == userid) {
        const Embed = new EmbedBuilder();
        Embed.setColor(config.embedColor.primary);
        Embed.setAuthor({ name: `Welcome Back ${message.author.globalName}` });
        if (queryResult.pingedBy.length == 0) {
            Embed.setDescription(`Hey There, You were AFK From <t:${queryResult.afkStartTime}:R>`)
        } else {
            Embed.setDescription(`Hey There, You were AFK From <t:${queryResult.afkStartTime}:${TimestampStyles.ShortTime}> & you're Pinged ${queryResult.pingedBy.length} Time(s)`);
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

async function afkCheckOnMentionMessage(message: any) {
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
            const userData: User = await getUserById(userid);
            if (!userData) continue;
            let embed: EmbedBuilder = new EmbedBuilder();
            let name: string;
            if (userData.globalName) {
                name = userData.globalName;
            } else {
                name = userData.username;
            }
            embed.setColor(config.embedColor.primary);
            embed.setAuthor({ name: `${name} is AFK`, iconURL: `${userData.avatarURL()}` });
            embed.setTitle(`From <t:${queryResult.afkStartTime}:${TimestampStyles.LongTime}>(<t:${queryResult.afkStartTime}:${TimestampStyles.RelativeTime}>)`);
            if (queryResult.reason != 'none') {
                embed.setDescription(reason);
            }
            message.reply({embeds: [embed]});

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


async function afkCheckOnRepliedMessage(message: any) {
    if (!message) return;
    if (message.author.bot) return;
    if (message?.reference?.messageId) {
        const msg = await message.channel.messages.fetch(message.reference.messageId);
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
                
                const userData: User = await getUserById(queryResult.userId);
                
                let embed: EmbedBuilder = new EmbedBuilder();
                let name: string;
                if (userData.globalName) {
                    name = userData.globalName;
                } else {
                    name = userData.username;
                }
                embed.setColor(config.embedColor.primary);
                embed.setAuthor({ name: `${name} is AFK`, iconURL: `${userData.avatarURL()}` });
                embed.setTitle(`From <t:${queryResult.afkStartTime}:${TimestampStyles.LongTime}>(<t:${queryResult.afkStartTime}:${TimestampStyles.RelativeTime}>)`);
                if (queryResult.reason != 'none') {
                    embed.setDescription(reason);
                }
                message.reply({embeds: [embed]});
            } else {
                return;
            }
        }
    }
    return;
}