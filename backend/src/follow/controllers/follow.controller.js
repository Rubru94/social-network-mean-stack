'use strict';

const mongoosePagination = require('mongoose-pagination');
const error = require('@core/models/error.model');
const mongooseService = require('@utils/services/mongoose.service');
const User = require('@user/models/user.model');
const PublicUser = require('@user/models/public-user.model');
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

async function getFollowingUsers(req, res, next) {
    try {
        const page = req.params.page ?? 1;
        const user = req.query?.user ? req.query.user : req.user.sub;
        if (!mongooseService.isValidObjectId(user)) throw new error.BadRequestError('Invalid user id');
        const itemsPerPage = req.query?.itemsPerPage ?? 5;

        Follow.find({ user })
            .sort('_id')
            .populate({ path: 'followed' })
            .paginate(page, itemsPerPage, (err, follows, total) => {
                if (err) return next(err);
                if (!follows) throw new error.NotFoundError('Follows not found');

                return res.status(200).send({
                    follows: follows.map((follow) => (follow.followed = new PublicUser(follow.followed))),
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
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
    getFollowingUsers,
    findById
};
