import { Message } from "discord.js";

var { EmbedBuilder } = require('discord.js');
var { fetchAction } = require('./fetchAction');
var {developerId, embedColor} = require('../../config.json')
var client = require('../index').client;

export const sendActionEmbed = async function (message: Message, endpoint: string, title: string): Promise<void> {
    if(!message){
        throw new Error("message object is null or undefined in sendActionEmbed.ts")
    }
    try {
        const gifData = await fetchAction(endpoint);
        if (!gifData) {
            throw new Error('Error fetching GIF data');
        }

        const Embed = new EmbedBuilder()
            .setColor(embedColor.primary)
            .setAuthor({ name: title, iconURL: message.author.displayAvatarURL(), url: gifData.url })
            .setImage(gifData.url);

        message.channel.send({ embeds: [Embed] });
    } catch (err: any) {
        let channel = await client.channels.cache.get(config.log.errorChannelId);
            channel.send(`
            Error: ${err.toString()}\n
            In sendActionEmbed.ts `);
            console.error(err);
        console.error(err);
        message.reply('There was an error. Please try again later.');
    }
}



