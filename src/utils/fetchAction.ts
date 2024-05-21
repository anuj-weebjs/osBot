var client = require('../index').client;
module.exports = {
    fetchAction: async (endpoint: string): Promise<object> => {
        try {
            const response = await fetch(`https://nekos.best/api/v2/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.results[0];
        } catch (err: any) {
            let channel = await client.channels.cache.get(config.log.errorChannelId);
            channel.send(`
            Error: ${err.toString()}\n
            In fetchAction.ts `);
            console.error(err);
            throw new Error('Error fetching data from the API');
        }
    }
}
