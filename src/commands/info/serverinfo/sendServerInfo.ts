var { EmbedBuilder } = require('discord.js');
module.exports = {
    execute: async (message: any) => {
        try {
            const guild: any = message.guild;
            const owner = await guild.fetchOwner();
            const guildCreatedAt: number = parseInt(guild.createdAt);
            const createdTimestamp = (guildCreatedAt / 1000) | 0;
            const ServerEmbed = new EmbedBuilder()
                .setColor('#2B2D31')
                .setTitle(`${guild.name} - Server info`)
                .setThumbnail(guild.iconURL({ size: 256 }))
                .setImage(guild.bannerURL({ size: 256 }))
                .addFields(
                    { name: 'Owner', value: `${owner.user.displayName} (${owner.user.id})`, inline: true },
                    {
                        name: 'Text Channels',
                        value: guild.channels.cache.filter((c: any) => c.type === 0).size.toString(),
                        inline: true,
                    },
                    {
                        name: 'Voice Channels',
                        value: guild.channels.cache.filter((c: any) => c.type === 2).size.toString(),
                        inline: true,
                    },
                    {
                        name: 'Category Channels',
                        value: guild.channels.cache.filter((c: any) => c.type === 4).size.toString(),
                        inline: true,
                    },
                    { name: 'Members', value: guild.memberCount.toString(), inline: true },
                    { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
                    { name: 'Role List', value: guild.roles.cache.toJSON().join(', '), inline: true },
                    { name: 'Created', value: `<t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)` }
                )
                .setFooter({ text: 'requested by ' + message.author.displayName, iconUrl: message.author.displayAvatarURL() })

            // message.channel.send(server.commands.toString())
            message.channel.send({ embeds: [ServerEmbed] });
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error Executing \`serverinfo\` command`)
        }
    }
}
