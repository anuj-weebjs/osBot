var { EmbedBuilder } = require('discord.js');
var { fetchAction } = require('./fetchAction');
var {developerId} = require('../../config.json')
var client = require('../index').client;

async function sendEmbed(message: any, endpoint: string, title: string) {
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
    } catch (error: any) {
        client.users.fetch(developerId, false).then((user: any) => {
            user.send(`${error.toString()} in send Action Embed`);
           });
        console.error(error);
        message.reply('There was an error. Please try again later.');
    }
}

module.exports = sendEmbed



