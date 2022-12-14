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
const PublicUser = require('@user/models/public-user.model');
const Follow = require('@follow/models/follow.model');
const utilService = require('@utils/services/util.service');

async function getReceivedMessages(req, res, next) {
    try {
        const user = req.user.sub;
        const page = req.params.page ?? 1;
        const itemsPerPage = req.query?.itemsPerPage ?? 5;

        Message.find(utilService.strToBoolean(req.query?.unviewed) ? { receiver: user, viewed: false } : { receiver: user })
            .sort({ createdAt: -1 })
            .populate('emitter receiver')
            .paginate(page, itemsPerPage, async (err, messages, total) => {
                if (err) return next(err);
                if (!messages) throw new error.NotFoundError('Received messages not found');

                return res.status(200).send({
                    messages: messages.map((message) => {
                        message.emitter = new PublicUser(message.emitter);
                        message.receiver = new PublicUser(message.receiver);
                        return message;
                    }),
                    itemsPerPage,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });
    } catch (err) {
        next(err);
    }
}

async function getUnviewedCount(req, res, next) {
    try {
        const user = req.user.sub;
        const unviewedMessages = await Message.count({ receiver: user, viewed: false });

        res.status(200).send({ unviewedMessages });
    } catch (err) {
        next(err);
    }
}

async function getSentMessages(req, res, next) {
    try {
        const user = req.user.sub;
        const page = req.params.page ?? 1;
        const itemsPerPage = req.query?.itemsPerPage ?? 5;

        Message.find({ emitter: user })
            .sort({ createdAt: -1 })
            .populate('emitter receiver')
            .paginate(page, itemsPerPage, async (err, messages, total) => {
                if (err) return next(err);
                if (!messages) throw new error.NotFoundError('Emitter messages not found');

                return res.status(200).send({
                    messages: messages.map((message) => {
                        message.receiver = new PublicUser(message.receiver);
                        message.emitter = new PublicUser(message.emitter);
                        return message;
                    }),
                    itemsPerPage,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        delete req.body._id;
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

async function setViewed(req, res, next) {
    try {
        const user = req.user.sub;
        const messagesUpdated = await Message.updateMany({ receiver: user, viewed: false }, { viewed: true }, { new: true });

        return res.status(200).send(messagesUpdated);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getReceivedMessages,
    getSentMessages,
    getUnviewedCount,
    create,
    setViewed
};
