var config = require("../../../config.json");

module.exports = {
    once:true,
    execute(client: typeof Client){
        client.handleCommands();
        console.log(`Logged In as ${client.user.tag}`);
        client.user.setPresence({activities:[{name: config.activities.name}], status: config.status});
    }
};