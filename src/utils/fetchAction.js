const url = 'https://nekos.best/api/v2/'; // Replace with your API endpoint
module.exports = {
    fetchAction: async (endpoint) => {
        const response = await fetch(`${url}${endpoint}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(res => {
                data = res.results;
                // console.log(data);
                return data;
            })
            .catch(error => {
                return error;
            });

        
        // console.log(response[0])
        return await response[0];

    }
}