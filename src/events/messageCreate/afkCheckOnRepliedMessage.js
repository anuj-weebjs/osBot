const afkModel = require('../../model/afkModel.js');

module.exports = {
    execute: async (message) => {
        if (message.author.bot) return;


        if (message.reference != null) {
            const msg = await message.channel.messages.fetch(message.reference.messageId)
            try {
                var queryResult = await afkModel.findOne({ userId: msg.author.id });
            } catch (err) {
                console.log(err);
            }


            if (queryResult.reason) {
                if (queryResult.length < 1) return;

                const reason = queryResult.reason;

                if (queryResult.userId == msg.author.id) {
                    //message.reply(`Hey There! The user You're trying to Reach is Currently \`AFK\`(Away From Keyboard)\nSince <t:${queryResult.afkStartTime}:R>\nReason: \`${reason}\``);
                    if (queryResult.reason == 'none') {
                        message.reply(`He/She Went AFK <t:${queryResult.afkStartTime}:R>`);
                    } else {
                        message.reply(`He/She Went AFK <t:${queryResult.afkStartTime}:R> Because ${reason}`);
                    }
                } else {
                    return;
                }
            }
        }


    }
}