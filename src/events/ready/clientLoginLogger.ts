var config = require("../../../config.json");

module.exports = {
    once:true,
    execute(client: any){
        client.handleCommands();
        client.user.setPresence({activities:[{name: config.activities.name}], status: config.status});
        console.log(`Logged In as ${client.user.tag}`);
    }
};