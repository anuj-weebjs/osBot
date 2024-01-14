const { EmbedBuilder } = require('discord.js');
module.exports = {
    execute: async (message) => {
        try {

            const guild = message.guild
            // console.log(server.commands)
            const ServerEmbed = new EmbedBuilder()
                .setColor('#2B2D31')
                .setTitle(`${guild.name} - Server info`)
                .setThumbnail(guild.iconURL({ size: 256 }))
                .setImage(guild.bannerURL({ size: 256 }))
                .addFields(
                    { name: 'Owner', value: (await guild.fetchOwner()).user.tag, inline: true },
                    {
                        name: 'Text Channels',
                        value: guild.channels.cache.filter((c) => c.type === 0).size.toString(),
                        inline: true,
                    },
                    {
                        name: 'Voice Channels',
                        value: guild.channels.cache.filter((c) => c.type === 2).size.toString(),
                        inline: true,
                    },
                    {
                        name: 'Category Channels',
                        value: guild.channels.cache.filter((c) => c.type === 4).size.toString(),
                        inline: true,
                    },
                    { name: 'Members', value: guild.memberCount.toString(), inline: true },
                    { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
                    { name: 'Role List', value: guild.roles.cache.toJSON().join(', ') },
                )
                .setFooter({ text: 'requested by ' + message.author.tag, iconUrl: message.author.displayAvatarURL() })

            // message.channel.send(server.commands.toString())
            message.channel.send({ embeds: [ServerEmbed] });
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error Executing \`serverinfo\` command`)
        }

    }
}