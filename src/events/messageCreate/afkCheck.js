const database = require('../../database.js')
const path = require('node:path');
const fs = require('node:fs');
const config = require('../../config.json');

const prefix = config.PREFIX;
module.exports = {
    execute: async (message, client) => {
        if(message.author.bot) return;
        messageString = message.content;
        const regex = /<@(\d+)>/g;
        let userIds = [];
        let match;
        while ((match = regex.exec(messageString)) !== null) {
            userIds.push(match[1]); // Extracting the numbers from each match
        }
        if(userIds.length == 0) return;
        const queryResult = await database.main.readAfkData(userIds[0]);
        if(queryResult.length < 1) return;

        if(queryResult[0].userId == userIds[0]){
            message.reply(`Hey There! The user You're trying to Reach is Currently \`AFK\`(Away From Keyboard) Since <t:${queryResult[0].createdAt}>`);
        }else{
            return;
        }     

    }
}