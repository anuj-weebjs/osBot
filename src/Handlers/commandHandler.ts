var fs = require('fs');
var path = require('path');

module.exports = (client: any) => {
    client.handleCommands = async () => {
        const commandFolderPath = path.join(__dirname, '..', 'commands');
        const commandCategories = fs.readdirSync(commandFolderPath);

        const { commands } = client;

        for (const commandCategory of commandCategories) {
            const commandCategoryPath = path.join(commandFolderPath, commandCategory);
            const commandNames = fs.readdirSync(commandCategoryPath);
            for( const commandName of commandNames){
                const commandNamePath = path.join(commandCategoryPath, commandName);
                const commandFiles = fs.readdirSync(commandNamePath);
                for(const commandFile of commandFiles){
                    const commandFilePath = path.join(commandNamePath, commandFile);
                    const command = require(commandFilePath);
                    commands.set(commandName, command);
                    console.log(`✅ ${commandName}`);
                }
            }
        }
    }
}