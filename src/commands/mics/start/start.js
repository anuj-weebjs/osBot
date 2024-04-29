const miscModel = require('../../../model/miscModel');
const config = require('../../../config.json')
const prefix = config.PREFIX;

module.exports = {
    execute: async (message) => {

        userDataInDataBase = await miscModel.findOne({ 'userId': message.author.id });

        console.log(userDataInDataBase)

        if (!userDataInDataBase) {
            const a = message.createdTimestamp;
            const timeStamp = (a / 1000) | 0;

            const userData = new miscModel({
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