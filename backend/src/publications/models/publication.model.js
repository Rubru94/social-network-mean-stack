'use strict';

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const PublicationSchema = schema({
    user: { type: schema.ObjectId, ref: 'User' },
    text: String,
    file: String,
    createdAt: String
});

module.exports = mongoose.model('Publication', PublicationSchema);
