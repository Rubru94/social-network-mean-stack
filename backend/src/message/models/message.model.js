'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = Schema({
    emitter: { type: Schema.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.ObjectId, ref: 'User', required: true },
    viewed: { type: Boolean, default: false },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
