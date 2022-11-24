'use strict';

const User = require('@user/models/user.model');

function hello(req, res) {
    res.status(200).send({ msg: 'hello world !' });
}

module.exports = {
    hello
};
