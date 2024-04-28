const afkModel = require('../../model/afkModel');
const getUserById = require('../../utils/getUserById');

module.exports = {
    execute: async (message, client) => {
        if (message.author.bot) return;


        messageString = message.content;

        const regex = /<@(\d+)>/g;
        let userIds = [];
        let match;

        while ((match = regex.exec(messageString)) !== null) {
            userIds.push(match[1]); // Extracting the ids from each match
        }

        if (userIds.length == 0) return;

        for (let userid of userIds) {
            try {
                var queryResult = await afkModel.findOne({ userId: userid });
                if (!queryResult) {
                    throw new Error("There was an Error while retreving data from database")
                }
            } catch (err) {
                continue;
            }
            if (queryResult == null) return;

            if (queryResult.length < 1) continue;
            if (!queryResult.userId) continue;


            const reason = queryResult.reason;


            if (queryResult.userId == userid) {
                const userData = await getUserById(userid);
                if (queryResult.reason == 'none') {
                    message.reply(`${userData.globalName} Went \`AFK\` <t:${queryResult.afkStartTime}:R>`);
                } else {
                    message.reply(`${userData.globalName} Went \`AFK\` < t: ${queryResult.afkStartTime}: R > Because ${reason}`);
                }
            } else {
                continue;
            }
        }
    }
}