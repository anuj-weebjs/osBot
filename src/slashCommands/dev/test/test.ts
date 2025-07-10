import { CommandInteraction, SlashCommandBuilder } from "discord.js";
const developerId = process.env.DEV_ID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test Command that only developer can use'),
    async execute(interaction: CommandInteraction) {
        // await interaction.reply('Pong!');
        if (interaction.user.id == developerId) {

            interaction.reply("*meow~*");


        } else {

            interaction.reply('https://tenor.com/view/my-honest-reaction-gif-10673976111485284091');
            interaction.reply('only developer can use this command!')
        };
    },
};