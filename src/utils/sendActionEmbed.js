const { EmbedBuilder } = require('discord.js');
const {fetchAction} = require('./fetchAction');

async function sendEmbed(message, endpoint, title) {
    const gifData = await fetchAction(endpoint);
    console.log(gifData.url)
    if(gifData.url === undefined){
        message.reply('There Was an Error.. Try Again Later');
        return;
    }
    
    const Embed = new EmbedBuilder()
        .setColor('#FF6347')
        .setAuthor({name:title, iconURL:message.author.displayAvatarURL()})
        // .setTitle(title)
        .setImage(gifData.url);

    message.channel.send({embeds:[Embed]});
}



module.exports = sendEmbed


