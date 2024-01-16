const { EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const config = require('../../../config.json')

let actionDir = path.join(__dirname, '..', '..', 'actions');
function getActions() {
    const rawActions = fs.readdirSync(actionDir)
    const action = rawActions.map(element => `\`${element}\``);
    return action
}
console.log(getActions())


module.exports = {
    execute: async(message) =>{
        const helpEmbed = new EmbedBuilder()
            .setColor('#FF6347')
            .setTitle(`Available Commands`)
            .addFields(
                {name: 'Action command', value: getActions().toString(), inline: false}
            )
            .setFooter({text:`Example Usage: \`${config.PREFIX} <command> <args>\``});

        message.channel.send({ embeds: [helpEmbed]});
    }
}