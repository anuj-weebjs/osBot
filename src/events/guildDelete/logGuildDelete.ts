import { Guild, Client, Channel } from 'discord.js';
var config = require('../../../config.json');



export const execute = async (guild: Guild, client: Client) => {
    const channel: Channel | null = await client.channels.fetch(config.log.guildLeaveChannelId);
    if (!channel) return;
    const serverCount = client.guilds.cache.size;

    if (!channel.isTextBased()) return;
    channel.send(`Kicked Out of ${guild.name} Server, Server Count: ${serverCount}`);

}
// module.exports = {
//     execute: async (guild: Guild, client: Client) => {
//         const channel: Channel | null = await client.channels.fetch(config.log.guildLeaveChannelId);
//         if (!channel) return;
//         const serverCount = client.guilds.cache.size;

//         if (!channel.isTextBased()) return;
//         channel.send(`Kicked Out of ${guild.name} Server, Server Count: ${serverCount}`);

//     }
// }