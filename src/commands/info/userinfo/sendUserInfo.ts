var { EmbedBuilder } = require('discord.js')
var config = require('../../../../config.json');
var prefix = config.PREFIX;
module.exports = {
    structure: {
        name: "userinfo",
        description: "Get Info About Yourself Or Somebody Else",
        usage: `${prefix} userinfo <mention>`
    },
    execute: async (message: any) => {
        const messageArray = message.content.slice(2).trim().split(/ +/);
        messageArray.shift();
        if (!messageArray[0]) {
            var user = message.author;
        } else {
            var user = message.mentions.users.first() || message.guild.members.cache.get(messageArray[0])
        }

        var ServerEmbed = new EmbedBuilder()
            .setColor('#FF6347')
            .setTitle(`${user.globalName} - User info`)
            .setThumbnail(user.displayAvatarURL({ size: 256 }))
            .addFields(
                {
                    name: 'User Name',
                    value: user.username,
                    inline: true,
                },
                {
                    name: 'Global Name',
                    value: user.globalName.toString(),
                    inline: true,
                },
                {
                    name: 'Id',
                    value: user.id.toString(),
                    inline: true,
                },
                { name: 'Roles Count', value: message.guild.members.cache.get(user.id).roles.cache.size.toString() || "No Roles!", inline: true },
                { name: 'Created At', value: user.createdAt.toString() },
            )
            .setFooter({ text: 'requested by ' + message.author.tag, iconUrl: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [ServerEmbed] });

    }
}