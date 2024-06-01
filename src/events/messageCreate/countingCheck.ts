var config = require('../../../config.json');
var prefix = config.PREFIX;
var { evaluate } = require('mathjs');


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
        var number: any;
        try{
            number = evaluate(message.content);
        }catch{
            number = NaN;
        }
        
        // NumbersOnly?
        switch (queryResult.numbersOnly) {
            case true:
                //Is number?
                switch (Number.isNaN(number)) {
                    case false:
                        
                        //Is it the same user?
                        switch (queryResult.lastUserId == message.author.id) {
                            case true:
                                reject(message, `\`You cannot count twice! Now Next Number is 1\``, queryResult);
                                break;
                            case false:
                                //Is Number Correct?
                                switch (queryResult.lastNumber + 1 == number) {
                                    case true:
                                        done(message, queryResult);
                                        break;
                                    case false:
                                        reject(message, `\`${message.author.username} Has Ruined It! Now Next Number is 1\``, queryResult);
                                        break;
                                }
                                break;
                        }
                        break;
                    case true:
                        reject(message, `\`${message.author.username} Has Ruined It! Now Next Number is 1, You can Disable it by doing "${prefix} numbersonly"\``, queryResult);
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
                                reject(message, `\`You cannot count twice! Now Next Number is 1\``, queryResult);
                                break;
                            case false:
                                //Is Number Correct?
                                switch (queryResult.lastNumber + 1 == number) {
                                    case true:
                                        done(message, queryResult);
                                        break;
                                    case false:
                                        reject(message, `\`${message.author.username} Has Ruined It! Now Next Number is 1\``, queryResult);
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

async function reject(message: typeof Message, msg: string, doc: typeof countingDoc) {
    message.react('❌');
    doc.lastNumber = 0;
    doc.lastUserId = "00000000000000"
    await doc.save();
    message.reply(msg);
}

async function done(message: typeof Message, doc: typeof countingDoc) {
    doc.lastNumber = doc.lastNumber + 1;
    doc.lastUserId = message.author.id;
    await doc.save();
    message.react('✅');
}
