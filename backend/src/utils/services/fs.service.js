'use strict';

const fs = require('fs');

function existsPromise(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err) => {
            if (err) resolve(null);
            resolve(path);
        });
    });
}

function unlinkPromise(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) reject(err);
            resolve(path);
        });
    });
}

module.exports = { existsPromise, unlinkPromise };
