const { EmbedBuilder } = require('discord.js');
const index = require('../../../index.js');
const client = index.client;
const config = require('../../../config.json');
const prefix = config.PREFIX;

async function fetchMeme(subreddit) {
    try {
        const response = await fetch(`https://meme-api.com/gimme/${subreddit}`);

        if (!response) {
            throw new Error(`No Response from meme api`);
        }
        const data = await response.json();
        data.code = 200;

        return data;

    } catch (error) {
        console.error("Fetch error:", error);
        client.users.fetch('808318773257437216', false).then((user) => {
            user.send(err.toString());
        });
    }
}


module.exports = {
    execute: async (message) => {

        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();



        const Embed = new EmbedBuilder();
        Embed.setColor('#ADD8E6')
        if (args.length == 0) {
            Embed.setDescription(`Loading...(hint: You can also specify subreddit by ${prefix} meme [subreddit]`);
        } else {
            Embed.setDescription(`Loading...`);

        }

        message.channel.send({ embeds: [Embed] }).then(async (sentMessage) => {
            if (args.length == 0) {
                var meme = await fetchMeme("");
            } else {
                var meme = await fetchMeme(args[0]);
            }

            if (meme.code == 404) {
                Embed.setAuthor({ name: meme.message });
                sentMessage.edit({ embeds: [Embed] });
                return;
            }

            Embed.setTitle(meme.title);
            Embed.setDescription(`By ${meme.author} | ${meme.ups} Up Votes`);
            Embed.setImage(meme.preview[(meme.preview.length) - 1]);
            Embed.setFooter({ text: `From r/${meme.subreddit}` });
            Embed.setTimestamp();

            sentMessage.edit({ embeds: [Embed] });

        }).catch(error => {
            console.log("Error sending or editing message: " + error);
            message.channel.send("[500] Internal Server Error");
        });


    }
}  
