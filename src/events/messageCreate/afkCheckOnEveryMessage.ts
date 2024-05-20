var afkDoc = require('../../model/afkModel');
var {PREFIX} = require('../../../config.json')
module.exports = {
    execute: async (message: any) => {
        if (message.author.bot) return;

        const args = await message.content.slice(PREFIX.length).trim().split(/ +/);

        if(args[0].toLowerCase() === 'afk') return;

        const userid = message.author.id;
        var queryResult = await afkDoc.findOne({ userId: userid });

        if (queryResult == null) return;
        if (queryResult.userId == userid) {
            message.reply(`Welcome Back u were Afk from <t:${queryResult.afkStartTime}:R>`);
            await afkDoc.deleteMany({ userId: userid });
        }
    }
}