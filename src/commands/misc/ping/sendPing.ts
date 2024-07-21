var { EmbedBuilder } = require('discord.js');
var miscDoc = require('../../../model/userModel');
var config = require('../../../../config.json');
var prefix = config.PREFIX;
const ncpu = require("os").cpus().length;
let previousTime = new Date().getTime();
let previousUsage = process.cpuUsage();
let lastUsage: any;

function getCpuUsage() {
    const currentUsage = process.cpuUsage(previousUsage);

    previousUsage = process.cpuUsage();

    const currentTime = new Date().getTime();

    const timeDelta = (currentTime - previousTime) * 10;
    const { user, system } = currentUsage;

    lastUsage = { system: system / timeDelta, total: (system + user) / timeDelta, user: user / timeDelta };
    previousTime = currentTime;

    return lastUsage;
}

module.exports = {
    structure: {
        name: "ping",
        description: "Get Bot's Status",
        usage: `${prefix}ping`
    },
    execute: async (message: any, client: any) => {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        var dbLatency: number | undefined;
        const before = Date.now();
        const exisingDoc = await miscDoc({userId: message.author.id});
        if(exisingDoc){
            const after = Date.now();
            dbLatency = after - before; 
        }else{
            dbLatency = undefined;
        }

        const pingEmbed = new EmbedBuilder()
            .setColor(config.embedColor.invisible)
            .setTitle('Loading...');

        message.channel.send({ embeds: [pingEmbed] }).then(async (sentMessage: any) => {
            if (!sentMessage || !sentMessage.createdTimestamp || !message.createdTimestamp) {
                console.log('Failed to calculate ping. Message or timestamps are undefined.')
                pingEmbed.setTitle(`Failded to calculate ping`);
                sentMessage.edit({ embeds: [pingEmbed] });
                return;
            }

            
            const botLatency = sentMessage.createdTimestamp - message.createdTimestamp;
            const apiLatency = client.ws.ping;

            pingEmbed.setTitle('Pong!')
            pingEmbed.addFields(
                {
                    name: 'Bot Status',
                    value: `\`\`\`Response Latency: ${botLatency}ms\nAPI Latency: ${apiLatency}ms\nDatabase Latency: ${dbLatency?.toString()}ms\nUptime: ${uptime}\`\`\``
                },
                {
                    name: 'Server Status',
                    value: `\`\`\`Ram Usage: ${Math.round(process.memoryUsage().rss / (1024 * 1024)).toString()}mb\nCPU Usage: ${Math.round(getCpuUsage().total).toString()}%\`\`\``
                }
            )
            pingEmbed.setFooter({ text: 'requested by ' + message.author.tag, iconUrl: message.author.displayAvatarURL() });
            pingEmbed.setTimestamp();
            sentMessage.edit({ embeds: [pingEmbed] });
        }).catch((error: any) => {
            console.log("Error sending or editing message: " + error);
        });
    }
}