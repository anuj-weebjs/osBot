var client = require('../index').client;

var getUserById : any= async(id: string) => {

    let user = await client.users.fetch(id);

    if (!user.globalName) {
        user.globalName = user.username;
    }

    return user;

}

module.exports = getUserById;