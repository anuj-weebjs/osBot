var { Client, Guild } = require("discord.js");
var config = require('../../../config.json');

module.exports = {
    execute: async (guild: typeof Guild, client: typeof Client) => {

        let channel = await client.channels.cache.get(config.log.guildJoinChannelId);
        let serverCount = client.guilds.cache.size;
        channel.send(`Joined ${guild.name}, Server Count: ${serverCount}`);


    }
}