import { GuildMember, Message, EmbedBuilder } from "discord.js";

module.exports = {
    execute: async (message: Message) => {
        try {
            if (!message?.guild) {
                return message.channel.send({ content: `This command can only be executed in a server.` });
            };
            const owner = await message.guild.fetchOwner(),
                createdTimestamp: number = Math.floor(message.guild.createdTimestamp / 1000),
                channels = message.guild.channels.cache,
                roles = message.guild.roles.cache.filter(i => i.id !== message.guild?.roles.everyone.id),
                members = message.guild.members.cache;

            const ServerEmbed = new EmbedBuilder()
                .setColor('#2B2D31')
                .setTitle(`${message.guild.name} - Server info`)
                .setThumbnail(message.guild.iconURL({ size: 256 }))
                .setImage(message.guild.bannerURL({ size: 256 }))
                .addFields(
                    { name: 'Owner', value: `- ${owner.user.displayName} (${owner.user.id})` },
                    {
                        name: "Channels",
                        value: `- Text: ${channels.filter((c: any) => c.type === 0).size.toString()}\n- Voice: ${channels.filter((c: any) => c.type === 2).size.toString()}\n- Category: ${channels.filter((c: any) => c.type === 4).size.toString()}`,
                    },
                    { name: 'Members', value: `- ${members.sort((a, b) => a.joinedTimestamp! - b.joinedTimestamp!).first(10).map(i => `<@${i.id}>`).join(", ")} ${members.size > 15 ? `and **${members.size - 15}** more` : ""}` },
                    {
                        name: `Roles (${roles?.size ?? "0"} in total)`,
                        value: `- ${roles.size > 15 ? `${roles.first(15).map((i) => `<@&${i.id}>`).join(", ")} and **${roles?.size - 15}** more` : roles.first(15).map((i) => `<@&${i.id}>`).join(", ")} `,
                    },
                    { name: 'Created', value: `- <t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)` }
                )
                .setFooter({ text: 'Requested by ' + message.author.displayName, iconURL: message.author.displayAvatarURL() });

            message.channel.send({ embeds: [ServerEmbed] });
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error while executing \`serverinfo\` command.`)
        };
    }
};