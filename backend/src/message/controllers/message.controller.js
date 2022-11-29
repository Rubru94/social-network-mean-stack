'use strict';

const error = require('@core/models/error.model');
const FilePublication = require('@publication/models/file-publication.model');
const fsService = require('@utils/services/fs.service');
const isImage = require('is-image');
const mongoosePagination = require('mongoose-pagination');
const mongooseService = require('@utils/services/mongoose.service');
const path = require('path');
const User = require('@user/models/user.model');
const Message = require('@message/models/message.model');
const Publication = require('@publication/models/publication.model');
const Follow = require('@follow/models/follow.model');
const utilService = require('@utils/services/util.service');

async function create(req, res, next) {
    try {
        let message = new Message(req.body);
        message.emitter = req.user.sub;
        if (message.validateSync()) throw new error.BadRequestError(message.validateSync().message);

        message = await message.save();
        if (!message) throw new error.BadRequestError('Message not saved');

        return res.status(200).send(message);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    create
};
