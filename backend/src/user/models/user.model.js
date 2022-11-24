'use strict';

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = schema(
    {
        name: String,
        surname: String,
        nick: String,
        email: String,
        password: String,
        role: String,
        image: String
    } /* ,
    { timestamps: true } */ /**@mongo timestamps */
);

module.exports = mongoose.model('User', UserSchema);
