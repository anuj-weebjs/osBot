import mongoose from 'mongoose';
import { Model, Models, Schema } from 'mongoose';

const guildSchema: Schema = new mongoose.Schema({
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
});

var guildModel = mongoose.model('guildModel', guildSchema);
export{guildModel}
