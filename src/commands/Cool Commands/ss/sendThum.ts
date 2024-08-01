import { Client, Message, EmbedBuilder } from "discord.js";
var config = require('../../../../config.json');
var prefix = config.PREFIX;

module.exports = {
    structure:{
        name:'ss',
        description: `Get Screenshot of a Specific Website`,
        usage:`${prefix}ss <url>`,
    },
    execute: async (message: Message, client: Client, args: string[]) =>{
        const embed: EmbedBuilder = new EmbedBuilder();
        embed.setColor(config.embedColor.primary)

        if(args.length < 1){
            embed.setTitle(`Invailid Option, use \`${prefix}ss <url>\``);
            message.channel.send({embeds: [embed]});
            return;
        }
        
        let rawUrl = args[0];
        let encodedUrl = encodeURIComponent(args[0]);

        const url = `https://image.thum.io/get/width/1920/?url=${encodedUrl}`;
        let res = await fetch(url);
        
        if(res.status != 200){
            embed.setTitle(`make sure That url is correct and it contains https://`);
            message.channel.send({embeds: [embed]});
            return;
        }

        embed.setTitle(rawUrl);
        embed.setURL(rawUrl);
        embed.setImage(url);

        message.channel.send({embeds: [embed]});
        return;
    }
}