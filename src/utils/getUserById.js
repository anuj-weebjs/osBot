const index = require('../index');
const client = index.client;

async function getUserById(rawUserId) {

    const mentionedUser = rawUserId;
    const userIdRegExp = /<@(\d+)>/;
    const userId = mentionedUser.match(userIdRegExp);
    let user = await client.users.fetch(userId[1]);

    if(!user.globalName){
        user.globalName = user.username;
    }
    
    return user;

}

module.exports = getUserById;


