const mongoose = require('mongoose');

const miscSchema = new mongoose.Schema({
    userId: {
        type: String, required: [true]
    },
    createdAt: {
        type: String, required: [true]
    },
    lastUsedCommand: {
        type: String,
        default: "none",
    },
    lastUsedCommandTime: {
        type: String,
        default: 0
    }
});

const miscModel = mongoose.model('miscModel', miscSchema);
module.exports = miscModel; 