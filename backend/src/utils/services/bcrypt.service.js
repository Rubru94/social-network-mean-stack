'use strict';

const bcrypt = require('bcrypt-nodejs');

function hashPromise(data) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(data, null, null, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

function comparePromise(data, encrypted) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(data, encrypted, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

module.exports = { hashPromise, comparePromise };
