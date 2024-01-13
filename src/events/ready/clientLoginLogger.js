module.exports = {
    once:true,
    execute:(client) =>{
        console.log(`Logged In as ${client.user.tag}`);
        client.user.setPresence({activities:[{name: 'with depression'}], status: 'dnd'});
    }
};