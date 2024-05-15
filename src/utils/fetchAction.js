const url = 'https://nekos.best/api/v2/'; // Replace with your API endpoint

module.exports = {
    fetchAction: async (endpoint) => {
        try {
            const response = await fetch(`${url}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.results[0];
        } catch (error) {
            client.users.fetch('808318773257437216', false).then((user) => {
                user.send(error.toString());
               });
            console.error(error);
            throw new Error('Error fetching data from the API');
        }
    }
}
