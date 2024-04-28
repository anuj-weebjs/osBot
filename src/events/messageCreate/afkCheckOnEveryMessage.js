const afkModel = require('../../model/afkModel');

module.exports = {
    execute: async (message) => {
        if (message.author.bot) return;

        const userid = message.author.id;
        var queryResult = await afkModel.findOne({ userId: userid });

        if (queryResult == null) return;
        if (queryResult.userId == userid) {
            await afkModel.deleteMany({ userId: userid });
            message.reply(`AFK Status is Now \`Off!\``);
        }
    }
}