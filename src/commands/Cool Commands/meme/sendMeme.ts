var { EmbedBuilder } = require('discord.js');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
var developerId = config.developerId;

async function fetchMeme(subreddit: string) {
    try {
        const url = "https://meme-api.com/gimme/" + subreddit;
        const response = await fetch(url);

        if (!response) {
            throw new Error(`No Response from meme api`);
        }

        const data = await response.json();
        if (response.status == 404) {
            data.code = 404;
        } else {
            data.code = 200;

        }
        return data;
    } catch (err: any) {
        console.error("Fetch error:", err);
        let channel = await client.channels.cache.get(config.log.errorChannelId);
        channel.send(`
            Error: ${err.toString()}\n
            In fetchAction.ts `);
        console.error(err);
    }
}


module.exports = {
    structure: {
        name: "meme",
        description: "Get memes Through Reddit",
        usage: `${prefix} meme <subreddit>`
    },
    execute: async (message: any) => {

        const args = await message.content.slice(prefix.length).trim().split(/ +/);
        args.shift();



        const Embed = new EmbedBuilder();
        Embed.setColor('#ADD8E6')
        if (args.length == 0) {
            Embed.setDescription(`Loading...(hint: You can also specify subreddit by ${prefix} meme [subreddit]`);
        } else {
            Embed.setDescription(`Loading...`);

        }

        message.channel.send({ embeds: [Embed] }).then(async (sentMessage: any) => {

            
            if (args.length == 0) {
                var meme = await fetchMeme("");
            } else {
                let subreddit = args[0].toString();
                let containInvaildChars = validateString(subreddit);
                console.log(containInvaildChars)
                if(!containInvaildChars){
                    Embed.setAuthor({ name: "This Subreddit Contains Invalid Charecters" });
                    Embed.setDescription('Error');
                    sentMessage.edit({ embeds: [Embed] });
                    return;
                }

                var meme = await fetchMeme(subreddit);
            }

            if (meme.code == 404) {
                Embed.setAuthor({ name: meme.message });
                Embed.setDescription('error code: 404');
                sentMessage.edit({ embeds: [Embed] });
                return;
            }

            Embed.setTitle(meme.title);
            Embed.setDescription(`By ${meme.author} | ${meme.ups} Up Votes`);
            Embed.setImage(meme.preview[(meme.preview.length) - 1]);
            Embed.setFooter({ text: `From r/${meme.subreddit}` });
            Embed.setTimestamp();

            sentMessage.edit({ embeds: [Embed] });

        })


    }
}  


function validateString(input: string) {
    var regex = /^[a-zA-Z0-9]+$/;
    
    if (regex.test(input)) {
        return true;
    } else {
        return false;
    }
}