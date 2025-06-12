import { boolean } from "mathjs";

var mongoose = require('mongoose');

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
    pingedBy: {
        type: Array,
        default: []
    },
    hasChangedNick: {
        type: boolean,
        default: false
    },
    oldServerNickname: {
        type: String,
        deafult: null
    },
    afkGuildId: {
        type: String,
        required: [true]
    }
});

var afkModel = mongoose.model('afkModel', afkSchema);
module.exports = afkModel; 