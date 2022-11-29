'use strict';

const error = require('@core/models/error.model');
const FilePublication = require('@publication/models/file-publication.model');
const fsService = require('@utils/services/fs.service');
const isImage = require('is-image');
const mongoosePagination = require('mongoose-pagination');
const mongooseService = require('@utils/services/mongoose.service');
const path = require('path');
const User = require('@user/models/user.model');
const Publication = require('@publication/models/publication.model');
const Follow = require('@follow/models/follow.model');
const utilService = require('@utils/services/util.service');

function hello(req, res) {
    res.status(200).send({ msg: 'hello world messages !' });
}

async function create(req, res, next) {
    try {
    } catch (err) {
        next(err);
    }
}

module.exports = {
    hello,
    create
};
