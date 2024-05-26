var config = require('../../../config.json');
var prefix = config.PREFIX;


var countingDoc = require('../../model/countingModel');
module.exports = {
    execute: async (message: typeof Message, client: any) => {
        if (message.author.bot) return;
        if (message.content.toLowerCase().startsWith(prefix)) return;
        let guildId = message.guild.id;
        let channelId = message.channel.id;

        let queryResult = await countingDoc.findOne({ guildId: guildId });
        if (queryResult == null) return;
        if (channelId != queryResult.channelId) return;
        let number = parseInt(message.content);

        //NumbersOnly?
        switch (queryResult.numbersOnly) {
            case true:
                //Is number?
                switch (Number.isNaN(number)) {
                    case false:
                        //Is it the same user?
                        switch (queryResult.lastUserId == message.author.id) {
                            case true:
                                message.reply(`\`${message.author.username} Has Ruined It! Next Number Is 1 \``);
                                message.react('❌');
                                queryResult.lastNumber = 0;
                                queryResult.save();
                                break;
                            case false:
                                //Is Number Correct?
                                switch (queryResult.lastNumber + 1 == number) {
                                    case true:
                                        queryResult.lastNumber = queryResult.lastNumber + 1;
                                        queryResult.lastUserId = message.author.id;
                                        await queryResult.save();
                                        message.react('✅');
                                        break;
                                    case false:
                                        message.reply(`\`${message.author.username} Has Ruined It! Next Number Is 1 \``);
                                        message.react('❌');
                                        queryResult.lastNum3ber = 0;
                                        queryResult.save();
                                        break;
                                }
                                break;
                            // code block
                        }
                        break;
                    case true:
                        message.reply(`\`${message.author.username} Has Ruined It! Next Number Is 1 \``);
                        message.react('❌');
                        queryResult.lastNumber = 0;
                        queryResult.save();
                        break;
                }
                break;
            case false:
                //Is number?
                switch (Number.isNaN(number)) {
                    case false:
                        //Is it the same user?
                        switch (queryResult.lastUserId == message.author.id) {
                            case true:
                                message.reply(`\`${message.author.username} Has Ruined It! Next Number Is 1 \``);
                                message.react('❌');
                                queryResult.lastNumber = 0;
                                queryResult.save();
                                break;
                            case false:
                                //Is Number Correct?
                                switch (queryResult.lastNumber + 1 == number) {
                                    case true:
                                        queryResult.lastNumber = queryResult.lastNumber + 1;
                                        queryResult.lastUserId = message.author.id;
                                        await queryResult.save();
                                        message.react('✅');
                                        break;
                                    case false:
                                        message.reply(`\`${message.author.username} Has Ruined It! Next Number Is 1 \``);
                                        message.react('❌');
                                        queryResult.lastNumber = 0;
                                        queryResult.save();
                                        break;
                                }
                                break;
                        }
                        break;
                    case true:
                        break;
                }
                break;
        }


    }
}