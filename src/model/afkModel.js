const mongoose = require('mongoose');

const afkSchema = new mongoose.Schema({
    userId: {
        type: String, required: [true]
    },
    reason: {
        type: String,
        maxLength: 220,
        default: "none"
    },
    afkStartTime: {
        type: String,
        default: 0,
    },
});

const afkModel = mongoose.model('afkModel', afkSchema);
module.exports = afkModel; 