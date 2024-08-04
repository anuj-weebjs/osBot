import {Guild, Client, Channel} from 'discord.js';
var config = require('../../../config.json');

module.exports = {
    execute: async (guild:  Guild, client:  Client) => {

        const channel: Channel | null = await  client.channels.fetch(config.log.guildJoinChannelId);
        if(!channel) return;
        const serverCount = client.guilds.cache.size;
        
        if(!channel.isTextBased())return;
        
        channel.send(`Joined ${guild.name}, Server Count: ${serverCount}`);


    }
}