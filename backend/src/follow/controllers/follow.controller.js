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
    getAll,
    findById
};
