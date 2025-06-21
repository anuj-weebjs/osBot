import { Message, EmbedBuilder, Client, Channel, GuildChannel, User } from "discord.js";

var guildDoc = require("../../model/guildModel");
var userDoc = require('../../model/userModel');
var config = require('../../../config.json');
var developerId = config.developerId;


const cooldowns = new Map();
module.exports = {
    execute: async (message: Message, client: _Client) => {
        var prefix = null;
        if (!message || message.author.bot || !message.channel.isSendable() || message.channel.isDMBased() || !message.guild || !client.user?.id) return;

        const guildId = message.guild.id;
        const guildName = message.guild.name;
        const authorId = message.author.id;
        const authorUsername = message.author.username;
        const msgContent = message.content;
        const channel: Channel = message.channel;
        const clientPerms = channel.permissionsFor(client.user.id);
        if (!clientPerms) {
            throw new Error("Client Permissions are Null");
        }

        if (msgContent == `<@${config.clientId}>`) {
            let embed = new EmbedBuilder();
            embed.setDescription(`My default Prefix is \`${config.PREFIX}\`\nUse \`${config.PREFIX}help\`for help`);
            message.channel.send({ embeds: [embed] });
            return;
        }

        var messageUserId = authorId;
        var userData = await userDoc.findOne({ userId: messageUserId });

        if (!userData) {

            const _userData = new userDoc({
                userId: authorId,
                joinedAt: new Date(),
                customPrefixes: []
            })
            await _userData.save();
            userData = await userDoc.findOne({ userId: messageUserId });
        }

        var guildData: any = await guildDoc.findOne({ guildId: guildId });
        if (!guildData) {
            const _guildData = new guildDoc({
                guildId: guildId,
                customPrefixes: []
            });
            await _guildData.save();
            guildData = await guildDoc.findOne({ guildId: guildId });
        }
        if (!Array.isArray(userData?.customPrefixes)) {
            userData.customPrefixes = [];
        }

        if (!Array.isArray(guildData?.customPrefixes)) {
            if (guildData) {
                guildData.customPrefixes = [];
            }
        }

        // let prefixes = userData.customPrefixes.concat(guildData.customPrefixes, {prefix: `<@${config.clientId}>`});
        var prefixes = [];
        prefixes.push(`<@${config.clientId}>`, config.PREFIX, 'os');
        for (let i = 0; i < userData.customPrefixes.length; i++) {
            prefixes.push(userData.customPrefixes[i].prefix);
        }

        if (guildData) {

            for (let i = 0; i < guildData.customPrefixes.length; i++) {
                prefixes.push(guildData.customPrefixes[i].prefix);
            }

        }


        for (let i = 0; i < prefixes.length; i++) {
            if (msgContent.toLowerCase().startsWith(prefixes[i].toLowerCase())) {
                prefix = prefixes[i].toLowerCase();
            }
        }
        if (!prefix) {
            return;
        }

        if (!msgContent.toLowerCase().startsWith(prefix)) return;

        var args: any;
        args = msgContent.slice(prefix.length).trim().split(/ +/);
        const msgCommand = args.shift().toLowerCase();


        if (!clientPerms.has("SendMessages")) {

            client.users.fetch(authorId, { cache: false })
                .then((user: User) => {
                    user.send(`I don't ahve permissoins to send messages in ${guildName}`);
                })

            return;
        };

        if (!clientPerms.has("EmbedLinks")) {
            message.channel.send(`❌I don't Have Permissions To Send EmbedLinks!`);
            return;
        };


        const now = Date.now();
        const cooldownAmount = 3 * 1000; // 3 seconds cooldown

        if (!cooldowns.has(authorId)) {
            cooldowns.set(authorId, now);
        } else {
            const expirationTime = cooldowns.get(authorId) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${msgCommand}\` command.`);
            }

            cooldowns.set(authorId, now);
        }



        const { commands } = client;
        const command = commands.get(msgCommand);
        if (!command) return;
        try {
            await command.execute(message, client, args,)
        } catch (err: any) {
            const channel = client.channels.cache.get(config.log.errorChannelId);
            // const channel = client.channels.fetch(config.log.errorChannelId);
            if(!channel || !channel.isSendable()) return;
            channel.send(`
            Error: ${err.toString()}
            Stack: ${err.stack}
            Raw Message: ${msgContent}
            Command: ${msgCommand}
            Args: ${args.join(' ')}
            Guild: ${guildName} | ${guildId}
            User: ${authorUsername} | ${authorId}
            `);
            console.log(err);

            message.channel.send(`There was an error while executing \`${msgCommand}\` command. Data has Been Sent to Devlopers! The issue will be fixed soon`);
        } finally {
            const channel =  client.channels.cache.get(config.log.executeChannelId);
            if(!channel || !channel.isSendable()) throw new Error("Unable to Fetch executeChannel in prefixHandler.ts");
            const logEmbed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: `${authorUsername}`, iconURL: validateIconURL(message.author.avatarURL()) })
                .setTitle(message.guild.name)
                .setThumbnail(message.guild.iconURL())
                .setDescription(msgContent)
                .addFields(
                    { name: 'Global Name', value: `${message.author.globalName}`, inline: true },
                    { name: 'Username', value: authorUsername, inline: true },
                    { name: 'User Id', value: authorId, inline: true },
                    // { name: '\u200B', value: '\u200B' },
                    { name: 'Gulid Name', value: guildName, inline: true },
                    { name: 'Gulid Id', value: guildId, inline: true },
                )
                .setTimestamp();
            channel.send({ embeds: [logEmbed] });
            userData.lastUsedPrefix = prefix;
            await userData.save();
        }

        return;
    }
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