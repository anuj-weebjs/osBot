import { Client, EmbedBuilder, Message } from "discord.js";

var fs = require('node:fs');
var path = require('node:path');
var config = require('../../../../config.json');
var userDoc = require('../../../model/userModel');
var prefix = config.PREFIX;


module.exports = {
    structure: {
        name: "help",
        description: "Get Help",
        usage: `${prefix}help`
    },
    execute: async (message: Message, client: Client, args: string[]) => {
        if(!message.channel.isSendable() || !client.user)return;
       

        const Embed: EmbedBuilder = new EmbedBuilder();
        Embed.setColor(config.embedColor.primary);
        // Embed.setAuthor({name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: `https://github.com/anuj-weebjs/osBot`})
        Embed.setTitle(client.user.displayName);
        Embed.setThumbnail(client.user.displayAvatarURL());
        

        let commitData = await getLatestCommit();
        let repoData = await getRepoData();
        console.log(commitData)
        

        if(commitData && repoData){
            Embed.setFields([
                {name: "Latest Commit Message:", value: `\`${commitData.commit.message}\``},
                {name: "Latest Commit Author:", value: `\`${commitData.commit.author.name}\``},
                {name: "Latest Commit Date:", value: `\`${commitData.commit.author.date}\``}
            ])
        }else{
            Embed.setDescription("Could not retrieve latest commit details.")
        }


       
        message.channel.send({ embeds: [Embed] });
    }
}

async function getLatestCommit(): Promise<any | null>{
    const url = `https://api.github.com/repos/anuj-weebjs/osBot/commits?per_page=1`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // The API returns an array of commits, so the first element is the latest.
            return data[0];
        } catch (error) {
            console.error("Error fetching latest commit:", error);
            return null;
        }
}

async function getRepoData(): Promise<any | null>{
    const url = `https://api.github.com/repos/anuj-weebjs/osBot`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching latest commit:", error);
            return null;
        }
}
