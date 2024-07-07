var mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: [true]
    },
    customPrefixes: {
        type: [{ prefix: String, addedOn: Date }],
        default: []
    },
});

var guildModel = mongoose.model('guildModelModel', guildSchema);
module.exports = guildModel; 