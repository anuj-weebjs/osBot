var { Message } = require("discord.js");

var { EmbedBuilder } = require('discord.js');
var { fetchAction } = require('./fetchAction');
var {developerId} = require('../../config.json')
var client = require('../index').client;

async function sendEmbed(message: typeof Message, endpoint: string, title: string) {
    try {
        const gifData = await fetchAction(endpoint);
        if (!gifData) {
            throw new Error('Error fetching GIF data');
        }

        const Embed = new EmbedBuilder()
            .setColor('#ADD8E6')
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

module.exports = sendEmbed



