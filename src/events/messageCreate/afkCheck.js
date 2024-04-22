const database = require('../../database.js');

module.exports = {
    execute: async (message) => {
        if (message.author.bot) return;

        // To check replied message
        if (message.reference != null) {
            const msg = await message.channel.messages.fetch(message.reference.messageId)

            try {
                var rawQueryResult = await database.main.readAfkData(msg.author.id);
                if (!rawQueryResult[0]) {
                    return;
                }
            } catch (err) {
                console.error(err);
                return;
            }
            const queryResult = rawQueryResult[0];
            if (rawQueryResult.length < 1) return;

            const reason = queryResult.reason;

            if (queryResult.userId == msg.author.id) {

                message.reply(`Hey There! The user You're trying to Reach is Currently \`AFK\`(Away From Keyboard)\nSince <t:${queryResult.createdAt}>\nReason: \`${reason}\``);
            } else {
                return;
            }
            return;
        }

        // Checking if There is a mention in message
        messageString = message.content;
        const regex = /<@(\d+)>/g;
        let userIds = [];
        let match;

        while ((match = regex.exec(messageString)) !== null) {
            userIds.push(match[1]); // Extracting the numbers from each match
        }

        if (userIds.length == 0) return;

        try {
            var rawQueryResult = await database.main.readAfkData(userIds[0]);
            if (!rawQueryResult) {
                throw new Error("There was an Error while retreving data from database")
            }
        } catch (err) {
            console.error(err);
            return;
        }

        if (rawQueryResult.length < 1) return;

        const queryResult = rawQueryResult[0];

        if (!queryResult.userId) return;
        const reason = queryResult.reason;


        if (queryResult.userId == userIds[0]) {
            message.reply(`Hey There! The user You're trying to Reach is Currently \`AFK\`(Away From Keyboard),\nFrom: <t:${queryResult.createdAt}:R>,\nReason: \`${reason}\``);
        } else {
            return;
        }

    }
}