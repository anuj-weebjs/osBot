import { Message } from "discord.js";
import { errorLog } from "./sendLog";

var { EmbedBuilder } = require('discord.js');
var { fetchAction } = require('./fetchAction');
var {developerId, embedColor} = require('../../config.json')
var client = require('../index').client;

async function sendEmbed(message: Message, endpoint: string, title: string) {
    if(!message || !message.channel.isSendable()){
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
        errorLog(err, message)
        console.error(err);
        message.reply('There was an error. Please try again later.');
    }
}

module.exports = sendEmbed



