const url = 'https://nekos.best/api/v2/'; // Replace with your API endpoint

module.exports = {
    fetchAction: async (endpoint) => {
        try {
            const response = await fetch(`${url}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data.results[0]);
            return data.results[0];
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching data from the API');
        }
    }
}
