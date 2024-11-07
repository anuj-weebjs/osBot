

var { WebhookClient, Message } = require('discord.js');
var config = require('../../../config.json');
var guildModel = require('../../model/guildModel');
var countingDoc = require('../../model/countingModel');
var { evaluate } = require('mathjs');
var prefix = config.PREFIX;

module.exports = {
    execute: async (message: typeof Message, client: any) => {
        if (!message || message.author.bot || message.content.toLowerCase().startsWith(prefix)) return;

        const { guild, channel, author, content } = message;
        const guildId = guild.id;
        const channelId = channel.id;

        let queryResult = await countingDoc.findOne({ guildId });
        if (!queryResult || channelId !== queryResult.channelId) return;

        await message.delete();

        let number;
        try {
            number = evaluate(content);
        } catch {
            number = NaN;
        }

        if (Number.isNaN(number)) {
            await warn(message, `Uh oh ${author.username}, the next number is ${queryResult.lastNumber + 1}`);
            return;
        }

        if (queryResult.lastUserId === author.id) {
            await warn(message, `${author.username}, you cannot count twice!`);
            return;
        }

        if (queryResult.lastNumber + 1 !== number) {
            await warn(message, `${author.username}, the next number is ${queryResult.lastNumber + 1}`);
            return;
        }

        await processCorrectNumber(message, client, queryResult);
    }
}

async function warn(message: typeof Message, warningMessage: string) {
    const warning = await message.channel.send(`\`\`\`${warningMessage}\`\`\``);
    setTimeout(() => warning.delete(), 3000);
}

async function processCorrectNumber(message: typeof Message, client: any, doc: typeof countingDoc) {
    const { author, channel, content } = message;
    const bot = client.user;

    doc.lastNumber += 1;
    doc.lastUserId = author.id;
    await doc.save();

    let guild = await guildModel.findOne({ guildId: channel.guild.id });

    let webhook;
    if (!guild || !guild.webhook || !guild.webhook.id || !guild.webhook.token) {
        webhook = await createAndStoreWebhook(channel, bot);
    } else {
        webhook = new WebhookClient({
            id: guild.webhook.id,
            token: guild.webhook.token,
        });
    }

    await webhook.send({
        content,
        username: author.globalName || author.username,
        avatarURL: author.displayAvatarURL({ format: 'png', dynamic: true }),
    });

    await message.channel.setTopic(`Count to your heart's content! by OS Bot! The next number is ${doc.lastNumber + 1} (for Admins To disable it type "${prefix}counting disable")`);
}

async function createAndStoreWebhook(channel: any, bot: any) {
    const webhook = await channel.createWebhook({
        name: bot.username,
        avatar: bot.displayAvatarURL({ format: 'png', dynamic: true }),
    });

    await guildModel.findOneAndUpdate(
        { guildId: channel.guild.id },
        {
            $set: {
                "webhook.id": webhook.id,
                "webhook.token": webhook.token,
            }
        },
        { new: true, upsert: true }
    );

    return webhook;
}
