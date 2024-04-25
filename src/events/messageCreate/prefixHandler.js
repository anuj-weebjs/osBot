const path = require('node:path');
const fs = require('node:fs');
const config = require('../../config.json');
const miscModel = require('../../model/miscModel.js');
const { time } = require('node:console');

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
                message.channel.send(`**Terms of Service for os Discord Bot**\n
1. **Purpose**: The primary purpose of the Discord bot is to add emotions and action commands to enhance user interaction through embeds and gifs.\n
2. **Data Collection**: User Ids are Collected and Being Stored in database to keep track of bot users.\n
3. **User Agreement**: Users are required to agree terms or conditions to use the bot.\n
4. **Restrictions**: There are no restrictions on how users can use the bot as it is open-source.\n
5. **Content Moderation**: All pull requests and contributions to the bot's code must be free of inappropriate content. Users are encouraged to interact with each other respectfully using action commands.\n
6. **Liability**: There are no specific disclaimers or limitations of liability included in the TOS.\n
7. **Guidelines**: Users are encouraged to engage in playful interactions but are expected to refrain from abusive behavior or harassment.\n

**By Typing Following Command You will Agree to All Above TOS**\n

To Start, type \`${prefix} start\` `)
                return;
            }
        }

        const a = message.createdTimestamp;
        const currentTimeStamp = (a / 1000) | 0;


        const rawUsedCommandTime = userData.lastUsedCommandTime;
        const usedCommandTime = parseInt(rawUsedCommandTime);

        if (currentTimeStamp < (usedCommandTime + 10)) {
            message.channel.send(`Cooldown!!! I'm Hosted on free tier Hosting by render Cause My Developer Cant afford a vps So, Wait <t:${usedCommandTime + 10}:R>`);
            return;
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
                            console.log(err);
                            message.channel.send('[500] Internal Server Error');
                        } finally {
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