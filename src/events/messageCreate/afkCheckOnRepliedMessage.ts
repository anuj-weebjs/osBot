var afkDoc = require('../../model/afkModel.js');

module.exports = {
    execute: async (message: any) => {
        if(!message) return;
        if (message.author.bot) return;


        if (message.reference != null) {
            const msg = await message.channel.messages.fetch(message.reference.messageId)
            var queryResult = await afkDoc.findOne({ userId: msg.author.id });
            try {
            } catch (err) {
                console.log(err);
            }


            if (queryResult == null) return;
            if (queryResult.reason) {
                if (queryResult.length < 1) return;

                const reason = queryResult.reason;
                if(message.author.id == queryResult.userId) return;
                if (queryResult.userId == msg.author.id) {
                    if (queryResult.reason == 'none') {
                        message.reply(`He/She Went AFK <t:${queryResult.afkStartTime}:R>`);
                    } else {
                        message.reply(`He/She Went AFK <t:${queryResult.afkStartTime}:R> Reason: ${reason}`);
                    }
                } else {
                    return;
                }
            }
        }


    }
}