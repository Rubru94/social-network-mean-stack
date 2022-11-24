'use strict';

const bcrypt = require('bcrypt-nodejs');
const error = require('@core/models/error.model');
const User = require('@user/models/user.model');

function hello(req, res) {
    res.status(200).send({ msg: 'hello world !' });
}

async function create(req, res, next) {
    try {
        const user = new User(req.body);
        if (user.validateSync()) throw new error.BadRequestError(user.validateSync().message);
        await bcrypt.hash(user.password, null, null, (err, hash) => {
            user.password = hash;
        });

        return res.status(200).send(await user.save());
    } catch (err) {
        next(err);
    }
}

module.exports = {
    hello,
    create
};
