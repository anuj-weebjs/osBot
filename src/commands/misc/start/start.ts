var config = require('../../../../config.json')
var miscDoc = require('../../../model/miscmodel');
var prefix = config.PREFIX;

module.exports = {
    structure: {
        name: "start",
        description: "It is used for accepting TOS",
        usage: `${prefix} start`
    },
    execute: async (message: any) => {

        const userDataInDataBase = await miscDoc.findOne({ 'userId': message.author.id });

        if (!userDataInDataBase) {
            const a = message.createdTimestamp;
            const timeStamp = (a / 1000) | 0;

            const userData = new miscDoc({
                userId: message.author.id,
                createdAt: timeStamp
            })
            await userData.save();
            message.channel.send(`**Welcome** <@${message.author.id}> :3 \nGet Started By Typing \`${prefix} help\``);
        } else {
            message.channel.send(`Get Started By Typing \`${prefix} help\``);
        }
    }
}