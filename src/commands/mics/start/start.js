const miscModel = require('../../../model/miscModel');
const config = require('../../../config.json')
const prefix = config.PREFIX;

module.exports = {
    execute: async (message) => {

        userDataInDataBase = await miscModel.findOne({ 'userInfo.id': message.author.id });

        if (!userDataInDataBase) {
            const a = message.createdTimestamp;
            const timeStamp = (a / 1000) | 0;

            const userData = new miscModel({
                userId: message.author.id,
                createdAt: timeStamp
            })
            await userData.save();
            message.channel.send(`Arraaa Nice to meet you <@${message.author.id}> :3 \nGet Started By Typing \`${prefix} help\``);
        } else {
            message.channel.send(`Get Started By Typing \`${prefix} help\``);
        }
    }
}