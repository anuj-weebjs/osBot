const path = require('node:path');
const fs = require('node:fs');
const config = require('../../config.json');
const miscModel = require('../../model/miscModel.js');
//const { time } = require('../../../../TOS.md');

const prefix = config.PREFIX;
module.exports = {
    execute: async (message, client) => {
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        const msgCommand = await args.shift().toLowerCase();
        if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

        const userid = message.author.id;
        var userData = await miscModel.findOne({ userId: userid });


        if (!userData) {
            if (msgCommand != 'start') {
                await message.channel.send({
                    files: [{
                        attachment: 'TOS.md',
                        name: 'TOS.md'
                    }],
                    content: `In order to use the Bot you have to Accept TOS By Typing \`${prefix} start\``,
                });
                return;
            }
        }

        const a = message.createdTimestamp;
        const currentTimeStamp = (a / 1000) | 0;


        if (msgCommand != 'start') {

            const rawUsedCommandTime = userData.lastUsedCommandTime;
            const usedCommandTime = parseInt(rawUsedCommandTime);

            if (currentTimeStamp < (usedCommandTime + 10)) {
                message.channel.send(`Cooldown!!! I'm Hosted on free tier Hosting Cause My Developer Cant afford a vps So, Wait <t:${usedCommandTime + 10}:R>`);
                return;
            }

        }



        let commandsFolderPath = path.join(__dirname, '..', '..', 'commands');
        let commandsFolderFiles = fs.readdirSync(commandsFolderPath);

        for (const commandsFolderFile of commandsFolderFiles) {
            let commandsFolderFilePath = path.join(commandsFolderPath, commandsFolderFile)

            let commandFolders = fs.readdirSync(commandsFolderFilePath);

            for (let commandFolder of commandFolders) {
                let commandFolderPath = path.join(commandsFolderFilePath, commandFolder);
                let commandFiles = fs.readdirSync(commandFolderPath);
                if (commandFiles.length == 0) {
                    continue;
                }

                for (let commandFile of commandFiles) {
                    let commandFilePath = path.join(commandFolderPath, commandFile);
                    let command = require(commandFilePath);
                    if (msgCommand == commandFolder) {
                        try {
                            command.execute(message, ...args);
                        } catch (err) {
                            client.users.fetch('808318773257437216', false).then((user) => {
                                user.send(err.toString());
                               });
                            console.log(err);
                            message.channel.send('[500] Internal Server Error');
                        } finally {
                            if (msgCommand != 'start') {
                                userData.lastUsedCommand = msgCommand;
                                userData.lastUsedCommandTime = currentTimeStamp;
                                await userData.save();
                            }
                        }
                    }
                }
            }
        }
    }
}