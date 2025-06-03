
import { Client, EmbedBuilder, Message, MessageFlagsBitField } from "discord.js";
const client: Client = require('../index').client;
const config = require('../../config.json');

async function errorLog(err: any, message?: Message) {
    const errChannel = await client.channels.cache.get(config.log.errorChannelId);
    if (!errChannel?.isSendable()) {
        throw new Error("Error Channel is Not Sendalbe Channel");
    };

    const embed = new EmbedBuilder()
    .setColor("Red")
    .setDescription(`${err}`)
    if(message && message.guild){

        embed.addFields([
            {name: "message text:", value: message.content },
            {name: "message author:", value: `${message.author.username}`},
            {name: "server name:", value: `${message.guild.name}`},
            {name: "server owner id:", value: `${message.guild.ownerId}`},

        ])
        
    }

    errChannel.send({embeds: [embed]});
}

export { errorLog };