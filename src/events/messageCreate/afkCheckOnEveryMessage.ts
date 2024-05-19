var afkDoc = require('../../model/afkModel');

module.exports = {
    execute: async (message: any) => {
        if (message.author.bot) return;

        const userid = message.author.id;
        var queryResult = await afkDoc.findOne({ userId: userid });

        if (queryResult == null) return;
        if (queryResult.userId == userid) {
            message.reply(`Welcome Back u were Afk from <t:${queryResult.afkStartTime}:R>`);
            await afkDoc.deleteMany({ userId: userid });
        }
    }
}