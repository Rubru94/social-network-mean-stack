'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose
    .connect('mongodb://localhost:27017/social_network_mean', { useNewUrlParser: true, useUnifiedTopology: true })
    .then((db) => console.log('Db is connected'))
    .catch((err) => console.error(err));
