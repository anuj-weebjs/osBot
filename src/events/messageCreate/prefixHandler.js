const path = require('node:path');
const fs = require('node:fs');
const config = require('../../config.json');

const prefix = config.PREFIX;
module.exports = {
    execute: async (message, client) =>{
        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        const msgCommand = await args.shift().toLowerCase();
        if(!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;


        let commandsFolderPath = path.join(__dirname, '..', '..', 'commands');
        let commandsFolderFiles = fs.readdirSync(commandsFolderPath);

        for( const commandsFolderFile of commandsFolderFiles){
            let commandsFolderFilePath = path.join(commandsFolderPath, commandsFolderFile)

            let commandFolders = fs.readdirSync(commandsFolderFilePath);

            for (let commandFolder of commandFolders) {
                let commandFolderPath = path.join(commandsFolderFilePath, commandFolder);
                let commandFiles = fs.readdirSync(commandFolderPath);
                if(commandFiles.length == 0){
                    continue;
                }

                for (let commandFile of commandFiles ){
                    let commandFilePath = path.join(commandFolderPath, commandFile);
                    let command = require(commandFilePath);
                    if (msgCommand == commandFolder) {
                        try{
                            command.execute(message, client, args, ...args);
                        }catch(err){
                            console.log(err);
                            message.channel.send('There was an error executing that command.');
                        }
                    }
                }
            }
        }
    }
}