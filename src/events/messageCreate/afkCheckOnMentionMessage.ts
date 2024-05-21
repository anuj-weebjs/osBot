var afkDoc = require('../../model/afkModel');
var getUserById = require('../../utils/getUserById');

module.exports = {
    execute: async (message:any) => {
        if (message.author.bot) return;


        const messageString = message.content;

        const regex = /<@(\d+)>/g;
        let userIds: string[] = [];
        let match;

        while ((match = regex.exec(messageString)) !== null) {
            userIds.push(match[1]);
        }

        if (userIds.length == 0) return;

        for (let userid of userIds) {
            try {
                var queryResult = await afkDoc.findOne({ userId: userid });
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
                    message.reply(`${userData.globalName} Went \`AFK\` <t:${queryResult.afkStartTime}:R> Reason: ${reason}`);
                }
            } else {
                continue;
            }
        }
    }
}