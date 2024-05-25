var countingDoc = require('../../model/countingModel');
module.exports = {
    execute: async (message: typeof Message, client: any) => {
        if (message.author.bot) return;

        let guildId = message.guild.id;
        let channelId = message.channel.id;

        let queryResult = await countingDoc.findOne({ guildId: guildId });
        // console.log(queryResult)
        if (queryResult == null) return;
        let channel = await client.channels.cache.get(channelId);

        if (queryResult.lastNumberMessageId == null) {
            channel.messages.fetch({ after: queryResult.enableMessageId }).then((messages: any) => {
                let messagesArray = messages.array();
                for(let i = 0; i < messagesArray.length; i++)[
                    console.log(messagesArray[i].content)
                ]

            })
                .catch(console.error);
        }

        channel.messages.fetch({ after: queryResult.lastNumberMessageId }).then((messages: any) => {
            // console.log(messages)
            let messagesArray = messages.array();


        })
            .catch(console.error);


    }
}