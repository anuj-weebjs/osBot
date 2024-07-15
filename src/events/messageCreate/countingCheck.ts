
var config = require('../../../config.json');
var prefix = config.PREFIX;
var { evaluate } = require('mathjs');


var countingDoc = require('../../model/countingModel');
module.exports = {
    execute: async (_message: typeof Message, client: any) => {
        let message = _message;
        if (!message) return;
        if (message.author.bot) return;
        if (message.content.toLowerCase().startsWith(prefix)) return;
        let guildId = message.guild.id;
        let channelId = message.channel.id;

        let queryResult = await countingDoc.findOne({ guildId: guildId });
        if (queryResult == null) return;
        if (channelId != queryResult.channelId) return;
        _message.delete();
        var number: any;
        try {
            number = evaluate(message.content);
        } catch {
            number = NaN;
        }
        switch (Number.isNaN(number)) {
            case false:
                //Is it the same user?
                switch (queryResult.lastUserId == message.author.id) {
                    case true:
                        await warn(message, `${message.author.username}, You cannot Count twice!`);
                        break;
                    case false:
                        //Is Number Correct?
                        switch (queryResult.lastNumber + 1 == number) {
                            case true:
                                await done(message, client, queryResult);
                                break;
                            case false:
                                await warn(message,  `${message.author.username}, next number is ${queryResult.lastNumber + 1}`);
                                break;
                        }
                        break;
                }
                break;
            case true:
                await warn(message, `uh oh ${message.author.username}, next number is ${queryResult.lastNumber + 1}`);
                break;
        }


        return;
    }
}

async function warn(message: typeof Message, msg: string) {
    message.channel.send(`\`\`\`${msg}\`\`\``).then((msg: any) => {
        setTimeout(() => msg.delete(), 3000)
    })
    return;
}

async function done(message: typeof Message, client: typeof Client, doc: typeof countingDoc) {
    doc.lastNumber = doc.lastNumber + 1;
    doc.lastUserId = message.author.id;
    await doc.save();

    const userId = message.author.id;
    const channelId = message.channel.id;
    const user = await client.users.fetch(userId);
    const channel = await client.channels.fetch(channelId);


    const webhook = await channel.createWebhook({
        name: user.username,
        avatar: user.displayAvatarURL({ format: 'png', dynamic: true }),
    });
    await webhook.send(message.content, {
        username: user.globalName,
        avatarURL: user.displayAvatarURL({ format: 'png', dynamic: true }),
    });
    await webhook.delete();
    await message.channel.setTopic(`Count to your heart's content! by OS Bot! [Admins] To disable it type "${prefix} counting disable", next number is ${doc.lastNumber + 1}`);
    return;
}
