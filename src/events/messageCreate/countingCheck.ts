var config = require('../../../config.json');
var prefix = config.PREFIX;
var { evaluate } = require('mathjs');
var { WebhookClient } = require('discord.js')


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
        try {
            number = evaluate(message.content);
        } catch {
            number = NaN;
        }
        await message.delete();
        switch (Number.isNaN(number)) {
            case false:
                //Is it the same user?
                switch (queryResult.lastUserId == message.author.id) {
                    case true:
                        break;
                    case false:
                        //Is Number Correct?
                        switch (queryResult.lastNumber + 1 == number) {
                            case true:
                                done(message, client, queryResult);
                                break;
                            case false:
                                break;
                        }
                        break;
                }
                break;
            case true:
                
                break;
        }

    }
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
    await message.channel.setTopic(`Count to your heart's content! by OS Bot! [Admins] To disable it type "${prefix}" counting disable next number is ${doc.lastNumber}`);
}
