const index = require('../index');
const client = index.client;

async function getUserById(id) {

    let user = await client.users.fetch(id);

    if (!user.globalName) {
        user.globalName = user.username;
    }

    return user;

}

module.exports = getUserById;