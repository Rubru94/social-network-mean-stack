'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PublicationSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    file: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Publication', PublicationSchema);
