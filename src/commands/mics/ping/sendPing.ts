var { EmbedBuilder} = require('discord.js');
module.exports = {
    execute: async (message: any, client: any) => {
        const pingEmbed = new EmbedBuilder()
            .setColor('#FF6347')
            .setTitle('Pong!')
            .setDescription('Loading...')
            .addFields(
                { name: 'Ram', value: `${Math.round(process.memoryUsage().rss / (1024 * 1024)).toString()}mb`, inline: true }
            );

        message.channel.send({ embeds: [pingEmbed] }).then((sentMessage: any) => {
            if (!sentMessage || !sentMessage.createdTimestamp || !message.createdTimestamp) {
                console.log('Failed to calculate ping. Message or timestamps are undefined.')
                pingEmbed.setDescription(`Failded to calculate ping`);
                sentMessage.edit({ embeds: [pingEmbed] });
                return;
            } 

            const botLatency = sentMessage.createdTimestamp - message.createdTimestamp;
            const apiLatency = client.ws.ping;

            pingEmbed.setDescription(`Bot latency: ${botLatency}ms\n API Latency: ${apiLatency}ms`);
            pingEmbed.setFooter({ text: 'requested by ' + message.author.tag, iconUrl: message.author.displayAvatarURL() });
            pingEmbed.setTimestamp();

            sentMessage.edit({ embeds: [pingEmbed] });
        }).catch((error: any) => {
            console.log("Error sending or editing message: " + error);
        });
    }
}