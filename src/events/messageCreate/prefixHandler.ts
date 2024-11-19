import { Message, EmbedBuilder } from "discord.js";

var userDoc = require('../../model/userModel');
var guildDoc = require('../../model/guildModel');
var config = require('../../../config.json');
var developerId = config.developerId;


const cooldowns = new Map();
module.exports = {
    execute: async (message:  any, client: any) => {
        var prefix = null;
        if (!message || message.author.bot || !message.channel.isSendable() || message.channel.isDMBased() || !message.guild) return;

        if(message.content == `<@${config.clientId}>`){
            let embed = new EmbedBuilder();
            embed.setDescription(`My default Prefix is \`${config.PREFIX}\`\nUse \`${config.PREFIX}help\`for help`);
            message.channel.send({embeds: [embed]});
            return;
        }

        var messageUserId = message.author.id;
        var userData = await userDoc.findOne({ userId: messageUserId });

        if (!userData) {

            const _userData = new userDoc({
                userId: message.author.id,
                joinedAt: new Date(),
                customPrefixes: []
            })
            await _userData.save();
            userData = await userDoc.findOne({ userId: messageUserId });
        } 

        var guildData = await guildDoc.findOne({ guildId: message.guild.id});
        if(!guildData){
            const _guildData = new guildDoc({
                guildId: message.guild.id,
                customPrefixes: []
            });
            await _guildData.save();
            guildData = await guildDoc.findOne({ guildId: message.guild.id});
        }
        if (!Array.isArray(userData?.customPrefixes)) {
            userData.customPrefixes = [];
        }

        if (!Array.isArray(guildData?.customPrefixes)) {
            guildData.customPrefixes = [];
        }

        // let prefixes = userData.customPrefixes.concat(guildData.customPrefixes, {prefix: `<@${config.clientId}>`});
        var prefixes = [];
        prefixes.push(`<@${config.clientId}>`, config.PREFIX, 'os');
        for(let i = 0; i < userData.customPrefixes.length; i++){
            prefixes.push(userData.customPrefixes[i].prefix);
        }
        for(let i = 0; i < guildData.customPrefixes.length; i++){
            prefixes.push(guildData.customPrefixes[i].prefix);
        }

        for(let i = 0; i < prefixes.length; i++){
            if(message.content.toLowerCase().startsWith(prefixes[i].toLowerCase())){
                prefix = prefixes[i].toLowerCase();
            }
        }
        if(!prefix){
            return;
        }

        if (!message.content.toLowerCase().startsWith(prefix)) return;

        var args: any;
        args = message.content.slice(prefix.length).trim().split(/ +/);
        const msgCommand = args.shift().toLowerCase();


        if (!message.channel.permissionsFor(client.user.id).has("SendMessages")) { //You can do the same for EmbedLinks, ReadMessageHistory and so on
            client.users.fetch(message.author.id, false).then((user: any) => {
                user.send(`I don't Have Permissions To Send Messages In ${message.guild.name}`);
            });
            return;
        };

        if (!message.channel.permissionsFor(client.user.id).has("EmbedLinks")) {
            message.channel.send(`❌I don't Have Permissions To Send EmbedLinks!`);
            return;
        };


        const now = Date.now();
        const cooldownAmount = 3 * 1000; // 3 seconds cooldown

        if (!cooldowns.has(message.author.id)) {
            cooldowns.set(message.author.id, now);
        } else {
            const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${msgCommand}\` command.`);
            }

            cooldowns.set(message.author.id, now);
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
            userData.lastUsedPrefix = prefix;
            await userData.save();
        }

        return;
    }
}
