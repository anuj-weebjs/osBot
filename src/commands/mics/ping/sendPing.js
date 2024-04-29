const index = require('../../../index');
const client = index.client;
const memory = require('memory');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    execute: async (message) => {
        const _memory = memory();
        const pingEmbed = new EmbedBuilder()
            .setColor('#FF6347')
            .setTitle('Pong!')
            .setDescription('Loading...')
            .addFields(
                { name: 'Ram', value: `${_memory.toString()}mb`, inline: true }
            );

        message.channel.send({ embeds: [pingEmbed] }).then(sentMessage => {
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
        }).catch(error => {
            console.log("Error sending or editing message: " + error);
        });
    },
};