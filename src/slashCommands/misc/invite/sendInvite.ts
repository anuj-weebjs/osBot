import { ChatInputCommandInteraction, Client, SlashCommandBuilder, EmbedBuilder } from "discord.js";
let invisibleEmbedColor: any = process.env.INVISIBLE_EMBED_COLOR || "#2B2D31";
let primaryClr: any = process.env.PRIMARY_EMBED_COLOR;
let clientId;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription(`Send's Bot Invite Link`),
    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        if (!interaction.isChatInputCommand() || !primaryClr) return;
        let embed = new EmbedBuilder();
        embed.setColor(primaryClr);
        embed.setDescription(`https://discord.com/oauth2/authorize?client_id=${client.user?.id}`)

        interaction.reply({embeds: [embed]});

    }
};