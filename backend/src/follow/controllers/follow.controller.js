'use strict';

const mongoosePagination = require('mongoose-pagination');
const error = require('@core/models/error.model');
const mongooseService = require('@utils/services/mongoose.service');
const User = require('@user/models/user.model');
const Follow = require('@follow/models/follow.model');
const fsService = require('@utils/services/fs.service');
const path = require('path');

function hello(req, res) {
    res.status(200).send({ msg: 'follow hello world !' });
}

async function create(req, res, next) {
    try {
        let follow = new Follow(req.body);
        follow.user = req.user.sub;
        if (follow.validateSync()) throw new error.BadRequestError(follow.validateSync().message);

        /**
         * @info Every ObjectId instance supports the "equals" method allowing you to provide your comparison value
         */
        if (follow.user.equals(follow.followed)) throw new error.BadRequestError('User & followed cannot be the same user');

        follow = await follow.save();
        if (!follow) throw new error.BadRequestError('Follow not saved');

        return res.status(200).send(follow);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const user = req.user.sub;
        const followed = req.params.id;

        const follow = await Follow.find({ user, followed });
        await Follow.find({ user, followed }).deleteMany();

        return res.status(200).send(follow);
    } catch (err) {
        next(err);
    }
}

async function getAll(req, res, next) {
    try {
        const page = req.params.page ?? 1;
        const itemsPerPage = req.query?.itemsPerPage ?? 5;

        /**
         * @info using callback()
         */
        User.find()
            .sort('_id')
            .paginate(page, itemsPerPage, (err, users, total) => {
                if (err) next(err);
                if (!users) throw new error.NotFoundError('Users not found');
                return res.status(200).send({ users, total, pages: Math.ceil(total / itemsPerPage) });
            });
    } catch (err) {
        next(err);
    }
}

async function findById(req, res, next) {
    try {
        const id = req.params?.id;
        if (!mongooseService.isValidObjectId(id)) throw new error.BadRequestError('Invalid id');
        const user = await User.findById(id);
        if (!user) throw new error.NotFoundError('User not found');

        res.status(200).send(user);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    hello,
    create,
    remove,
    getAll,
    findById
};
