var config = require("../../../config.json");

module.exports = {
    once:true,
    execute(client: _Client){
        client.handleCommands();

        if(!client.user){
            console.error("client.user is null!")
            process.exit(1);
        }
        client.user.setPresence({activities:[{name: config.activities.name}], status: config.status});
        console.log(`Logged In as ${client.user.tag}`);
    }
};