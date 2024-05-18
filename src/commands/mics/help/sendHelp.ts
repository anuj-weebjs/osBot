var { EmbedBuilder } = require('discord.js');
var fs = require('node:fs');
var path = require('node:path');
var config = require('../../../../config.json');

let actionsDir = path.join(__dirname, '..', '..', 'actions');
let emotionsDir = path.join(__dirname, '..', '..', 'emotes');
let infoDir = path.join(__dirname, '..', '..', 'info');
let coolCommandsDir = path.join(__dirname, '..', '..', 'Cool Commands');
function getFileNames(dir:string) {
    const rawActions = fs.readdirSync(dir)
    const dirFiles = rawActions.map((element: any) => `\`${element}\``);
    return dirFiles;
}


module.exports = {
    execute: async (message: any) => {
        const helpEmbed = new EmbedBuilder()
            .setColor('#FF6347')
            .setTitle(`Available Commands`)
            .addFields(
                { name: 'Useful Commands', value: getFileNames(coolCommandsDir).toString(), inline: false }
            )
            .addFields(
                { name: 'Emotes', value: getFileNames(emotionsDir).toString(), inline: false }
            )
            .addFields(
                { name: 'Actions', value: getFileNames(actionsDir).toString(), inline: false }
            )
            .addFields(
                { name: 'Info', value: getFileNames(infoDir).toString(), inline: false }
            )
            .setFooter({ text: `Example Usage: \`${config.PREFIX} <command> <args>\`` });

        message.channel.send({ embeds: [helpEmbed] });
    }
}