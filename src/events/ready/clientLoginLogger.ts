import 'dotenv/config';

module.exports = {
    once:true,
    execute(client: _Client){

        const activityName = process.env.ACTIVITY_NAME;
        const activityStatus: any = process.env.ACTIVITY_STATUS || 'online';

        if(!activityName || !activityStatus){
            console.error("Make sure you have filled ACTIVITY_NAME and ACTIVITY_STATUS in your .env file");
            process.exit(1);
        }

        client.handleCommands();

        if(!client.user){
            console.error("client.user is null!")
            process.exit(1);
        }
        client.user.setPresence({activities:[{name: activityName}], status: activityStatus});
        console.log(`Logged In as ${client.user.tag}`);
    }
};