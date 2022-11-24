'use strict';

const error = require('@core/models/error.model');
const User = require('@user/models/user.model');
const bcryptService = require('@utils/services/bcrypt.service');
const loginResponse = require('@user/models/loginResponse.model');

function hello(req, res) {
    res.status(200).send({ msg: 'hello world !' });
}

async function create(req, res, next) {
    try {
        const user = new User(req.body);
        if (user.validateSync()) throw new error.BadRequestError(user.validateSync().message);

        const userExistent = await User.findOne({ email: user.email });
        if (userExistent) throw new error.BadRequestError('Email already used');

        user.password = await bcryptService.hashPromise(user.password);

        return res.status(200).send(await user.save());
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const user = new User(req.body);
        if (user.validateSync()) throw new error.BadRequestError(user.validateSync().message);

        const userExistent = await User.findOne({ email: user.email });
        if (!userExistent) throw new error.NotFoundError('User not exist');

        let isValidPassword = await bcryptService.comparePromise(user.password, userExistent.password);
        if (!isValidPassword) throw new error.BadRequestError('Invalid password');

        return res.status(200).send(new loginResponse(userExistent));
    } catch (err) {
        next(err);
    }
}

module.exports = {
    hello,
    create,
    login
};
