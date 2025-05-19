import { Client, EmbedBuilder, Message } from "discord.js";

var fs = require('node:fs');
var path = require('node:path');
var config = require('../../../../config.json');
var userDoc = require('../../../model/userModel');
var prefix = config.PREFIX;

let actionsDir = path.join(__dirname, '..', '..', 'actions');
let countingDir = path.join(__dirname, '..', '..', 'fun');
let emotionsDir = path.join(__dirname, '..', '..', 'emotes');
let infoDir = path.join(__dirname, '..', '..', 'info');
let coolCommandsDir = path.join(__dirname, '..', '..', 'useful');
let miscDir = path.join(__dirname, '..', '..', 'misc');
function getFileNames(dir: string) {
    const rawActions = fs.readdirSync(dir)
    const dirFiles = rawActions.map((element: any) => `\`${element}\``);
    return dirFiles;
}


module.exports = {
    structure: {
        name: "help",
        description: "Get Help",
        usage: `${prefix}help`
    },
    execute: async (message: Message, client: any, args: string[]) => {
        if(!message.channel.isSendable())return;

        const Embed: EmbedBuilder = new EmbedBuilder();
        Embed.setColor(config.embedColor.primary);
        if (args.length < 1) {

            Embed.setTitle(`List of Available Commands`);
            Embed.addFields(
                { name: 'Useful Commands', value: getFileNames(coolCommandsDir).toString(), inline: false }
            )
            Embed.addFields(
                { name: 'Misc', value: getFileNames(miscDir).toString(), inline: false }
            )
            Embed.addFields(
                { name: 'Emotes', value: getFileNames(emotionsDir).toString(), inline: false }
            )
            Embed.addFields(
                { name: 'Actions', value: getFileNames(actionsDir).toString(), inline: false }
            )
            Embed.addFields(
                { name: 'Info', value: getFileNames(infoDir).toString(), inline: false }
            )
            Embed.addFields(
                { name: 'Counting Activity', value: getFileNames(countingDir).toString(), inline: false }
            )
            Embed.addFields({ name: '\u200B', value: '\u200B' },)
            Embed.addFields(
                {
                        name: `Written in Typescript`, value: `Contribute to this project on [github](https://github.com/anuj-weebjs/osBot) *pwease*`
                }
            )

            Embed.setFooter({ text: `Type "${config.PREFIX}help <command>" To Get Info of That Particular command` });

        } else {
            const { commands } = client;
            const command = commands.get(args.shift()?.toLowerCase());
            if (!command) {
                Embed.setColor(config.embedColor.alert);
                Embed.setTitle(`Command Not Found`);
                Embed.setDescription(`Type ${prefix}help for list of available commands`);
            }else{
                
                Embed.setTitle(`**${command.structure.name}**`);
                Embed.addFields(
                    {name: 'Description:', value: `\`\`\`${command.structure.description}\`\`\``}
                );
                Embed.addFields(
                    {name: 'Usage:', value: `\`\`\`${command.structure.usage}\`\`\``}
                );
            }
        }
        message.channel.send({ embeds: [Embed] });
    }
}
