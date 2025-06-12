import { Client, EmbedBuilder, Message } from "discord.js";

const config = require('../../../../config.json');
const prefix = config.PREFIX;

// Define interfaces for better type safety with GitHub API responses
interface GitHubCommitAuthor {
    name: string;
    date: string;
}

interface GitHubCommit {
    message: string;
    author: GitHubCommitAuthor;
}

interface GitHubCommitResponse {
    commit: GitHubCommit;
}

module.exports = {
    structure: {
        name: "about",
        description: "Displays information about the bot and its latest commit.",
        usage: `${prefix}about`
    },
    execute: async (message: Message, client: Client) => {
        if(!message.channel.isSendable() || !client.user)return;
       

        const Embed: EmbedBuilder = new EmbedBuilder();
        Embed.setColor(config.embedColor.primary);
        // Embed.setAuthor({name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: `https://github.com/anuj-weebjs/osBot`})
        Embed.setTitle(client.user.displayName);
        Embed.setThumbnail(client.user.displayAvatarURL());
        

        const commitData = await getLatestCommit();
        

        if(commitData){
            const commitDate = new Date(commitData.commit.author.date).toLocaleDateString();
            Embed.setFields([
                {name: "Latest Commit Message:", value: `\`${commitData.commit.message}\``},
                {name: "Latest Commit Author:", value: `\`${commitData.commit.author.name}\``},
                {name: "Latest Commit Date:", value: `\`${commitDate}\``}
            ])
        }else{
            Embed.setDescription("Could not retrieve latest commit details from GitHub.")
        }


       
        message.channel.send({ embeds: [Embed] });
    }
}

async function getLatestCommit(): Promise<GitHubCommitResponse | null>{
    const url = `https://api.github.com/repos/anuj-weebjs/osBot/commits?per_page=1`;
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error(`GitHub API error! Status: ${response.status}`);
                return null;
            }
            const data = await response.json();
        
            return data[0] as GitHubCommitResponse;
        } catch (error) {
            console.error("Error fetching latest commit:", error);
            return null;
        }
}

// The getRepoData function was not used, so it's removed.
// If you plan to use it, you can add it back with proper typing.
// async function getRepoData(): Promise<any | null>{
// ...
// }
