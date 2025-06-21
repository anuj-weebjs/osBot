import { Guild, Client, Channel, EmbedBuilder, GuildInviteManager } from 'discord.js';
var config = require('../../../config.json');

module.exports = {
    execute: async (guild: Guild, client: Client) => {

        const channel: Channel | null = await client.channels.fetch(config.log.guildJoinChannelId);
        if (!channel || !channel.isSendable()) return;
        const serverCount = client.guilds.cache.size;
        if (!channel.isTextBased()) return;

        const logEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL())
            .setDescription(guild.description)
            .setImage(guild.bannerURL())
            .addFields(
                { name: "Member Count", value: guild.memberCount.toString(), inline: false },
                { name: 'Created at', value: guild.createdAt.toDateString(), inline: false },
                { name: 'Nsfw Level', value: guild.nsfwLevel.toString(), inline: false },
                { name: 'Owner', value: `${await guild.fetchOwner()}`, inline: false },
            )
            .setTimestamp()
            .setFooter({text: `Server Count: ${serverCount}`})

            channel.send({embeds: [logEmbed]});


    }
}