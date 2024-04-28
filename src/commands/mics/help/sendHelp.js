const { EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const config = require('../../../config.json')

let actionsDir = path.join(__dirname, '..', '..', 'actions');
let emotionsDir = path.join(__dirname, '..', '..', 'emotions');
let infoDir = path.join(__dirname, '..', '..', 'info');
let coolCommandsDir = path.join(__dirname, '..', '..', 'Cool Commands');
function getFileNames(dir) {
    const rawActions = fs.readdirSync(dir)
    const dirFiles = rawActions.map(element => `\`${element}\``);
    return dirFiles;
}


module.exports = {
    execute: async (message) => {
        const helpEmbed = new EmbedBuilder()
            .setColor('#FF6347')
            .setTitle(`Available Commands`)
            .addFields(
                { name: 'Cool Commands', value: getFileNames(coolCommandsDir).toString(), inline: false }
            )
            .addFields(
                { name: 'Emotions', value: getFileNames(emotionsDir).toString(), inline: false }
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