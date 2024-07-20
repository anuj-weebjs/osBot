var mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    customPrefixes: {
        type: [{ prefix: String, addedOn: Date }],
        default: []
    },
    webhook: {
        id: String,
        token: String,
    },
    welcomeEmbed: {
        
    }
});

var guildModel = mongoose.model('guildModel', guildSchema);
module.exports = guildModel;
