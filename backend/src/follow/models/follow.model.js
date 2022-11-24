'use strict';

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const FollowSchema = schema({
    user: { type: schema.ObjectId, ref: 'User' },
    followed: { type: schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Follow', FollowSchema);
