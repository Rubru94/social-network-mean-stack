'use strict';

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MessageSchema = schema({
    emmiter: { type: schema.ObjectId, ref: 'User' },
    receiver: { type: schema.ObjectId, ref: 'User' },
    text: String,
    createdAt: String
});

module.exports = mongoose.model('Message', MessageSchema);
