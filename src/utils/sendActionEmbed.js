const { EmbedBuilder } = require('discord.js');
const {fetchAction} = require('./fetchAction');

async function sendEmbed(message, endpoint, title) {
    try {
        const gifData = await fetchAction(endpoint);
        if (!gifData) {
            throw new Error('Error fetching GIF data');
        }

        const Embed = new EmbedBuilder()
        .setColor('#FF6347')
        .setAuthor({name:title, iconURL:message.author.displayAvatarURL()})
        .setImage(gifData.url);

        message.channel.send({ embeds: [Embed] });
    } catch (error) {
        console.error(error);
        message.reply('There was an error. Please try again later.');
    }
}

module.exports = sendEmbed


