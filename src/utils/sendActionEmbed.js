const { EmbedBuilder } = require('discord.js');
const { fetchAction } = require('./fetchAction');

async function sendEmbed(message, endpoint, title) {
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
    } catch (error) {
        client.users.fetch('808318773257437216', false).then((user) => {
            user.send(err.toString());
           });
        console.error(error);
        message.reply('There was an error. Please try again later.');
    }
}

module.exports = sendEmbed

process.on('uncaughtException', function (err) {
    console.error(err);
    client.users.fetch('808318773257437216', false).then((user) => {
        user.send(err.toString());
       });
  });


