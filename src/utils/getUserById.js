const client = require('../index');

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


