import { EmbedBuilder, User, TimestampStyles, Message, Client } from "discord.js";
import { text } from "stream/consumers";

var afkDoc = require('../../model/afkModel');
var getUserById = require('../../utils/getUserById');
var config = require('../../../config.json');

module.exports = {
    execute: async (message: any, client: any) => {

        if (!message) return;
        if (message.author.bot) return;

        afkCheckOnEveryMessage(message, client);
        afkCheckOnMentionMessage(message);
        afkCheckOnRepliedMessage(message);
        return;
    }
}

async function afkCheckOnEveryMessage(message: any, client: any) {
    if (!message) return;
    if (message.author.bot) return;
    const userid = message.author.id;
    var queryResult = await afkDoc.findOne({ userId: userid });
    if (queryResult == null) return;


    if (queryResult.userId == userid) {
        const Embed = new EmbedBuilder();
        Embed.setColor(config.embedColor.primary);
        Embed.setAuthor({ name: `Yo ${message.author.globalName}` });
        if (queryResult.pingedBy.length == 0) {
            // Embed.setDescription(`You were AFK From <t:${queryResult.afkStartTime}:R>`)
            Embed.addFields({
                name: `Welcome Back!`,
                value: `You were AFK From <t:${queryResult.afkStartTime}:R> :3`,
                inline: false
            })

        } else {
            Embed.setDescription(`Welcome Back! You were AFK From <t:${queryResult.afkStartTime}:${TimestampStyles.ShortTime}> & you're Pinged ${queryResult.pingedBy.length} Time(s)`);
            for (let i = 0; i < queryResult.pingedBy.length; i++) {
                Embed.addFields({
                    name: `By @${queryResult.pingedBy[i].username}`,
                    value: `[Click Here](https://discord.com/channels/@me/${queryResult.pingedBy[i].channelId}/${queryResult.pingedBy[i].messageId}) To See Message`,
                    inline: true
                })
            }
        }

        setDefaultUserName(message, queryResult, client);
        await safeReply(message, { embeds: [Embed] });
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
            
            let titleStr = `${name} is AFK`
            
            if (queryResult.reason != 'none') {
                titleStr = `${name} is ${reason}`
            }
            
            embed.setAuthor({ name: titleStr, iconURL: validateIconURL(userData.avatarURL()) });
            embed.setImage('https://c.tenor.com/w4wGt0MgpjMAAAAd/tenor.gif')
            await safeReply(message, { embeds: [embed] });

            if (queryResult?.pingedBy.length > 10) {
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
                let titleStr = `${name} is AFK`;
                // embed.setTitle(`From <t:${queryResult.afkStartTime}:${TimestampStyles.LongTime}>(<t:${queryResult.afkStartTime}:${TimestampStyles.RelativeTime}>)`);
                if (queryResult.reason != 'none') {
                    titleStr = `${name} is ${reason}`
                }
                embed.setAuthor({ name: titleStr, iconURL: validateIconURL(userData.avatarURL()) });
                embed.setImage('https://c.tenor.com/w4wGt0MgpjMAAAAd/tenor.gif')
                await safeReply(message, { embeds: [embed] });
            } else {
                return;
            }
        }
    }
    return;
}

async function setDefaultUserName(message: any, queryResult: any, client: Client): Promise<void> {

    const clientPerms = message.guild.members.me.permissions.has("ManageNicknames");


    if (!clientPerms) {

        message.channel.send('I don\'t have permission to change your nickname!');
        return

    }

    let changeNick = true;

    if (message.member?.roles.highest.position > message.guild.members.resolve(client.user).roles.highest.position) {
        changeNick = false;

        const note = await message.channel.send(`Auto AFK Nickname Feature wont work. Please Put my role Above yours to make it workable.`);
        setTimeout(() => note.delete(), 7000);

    }

    let authorName = message.author.username;
    if (message.author.globalName) {
        authorName = message.author.globalName;
    }


    try {
        if (changeNick) {
            await message.member.setNickname(authorName);
        }

    } catch (err) {
        const note = await message.reply(`Unable to change Nickname back to normal. Please try to put my role Above yours to make it workable.`);
        setTimeout(() => note.delete(), 7000);

    }
    return
}

function validateIconURL(url: string | null): string | undefined {
    if (!url || url === 'null') return undefined;
    try {
        new URL(url);
        return url;
    } catch {
        return undefined;
    }
}

async function safeReply(message: any, options: any): Promise<void> {
    try {
        if (message.reference?.messageId) {
            await message.channel.messages.fetch(message.reference.messageId);
        }
        await message.reply(options);
    } catch (error: any) {
        if (error.code === 10008) { // Unknown Message
            await message.channel.send(options);
        } else {
            console.error('Error sending reply:', error);
        }
    }
}