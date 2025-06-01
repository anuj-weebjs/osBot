var fs = require('node:fs');
var path = require('node:path');

module.exports = (client: any) => {
    client.handleEvents = async () => {
        const eventFolderPath = path.join(__dirname, '..', 'events');
        const events = fs.readdirSync(eventFolderPath);
        for (const eventName of events) {
            const eventFiles = fs.readdirSync(path.join(eventFolderPath, eventName));
            for (const eventFile of eventFiles) {
                const eventModule = require(path.join(eventFolderPath, eventName, eventFile));
                if (eventModule.once) {
                    client.once(eventName, (...args: any[]) => eventModule.execute(...args, client));
                } else {
                    client.on(eventName, (...args: any[]) => eventModule.execute(...args, client));
                }
            }
        }
    }
}