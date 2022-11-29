'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = Schema({
    emmiter: { type: Schema.ObjectId, ref: 'User' },
    receiver: { type: Schema.ObjectId, ref: 'User' },
    viewed: Boolean,
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
