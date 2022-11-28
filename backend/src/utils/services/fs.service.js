'use strict';

const fs = require('fs');

const unlinkPromise = (path) =>
    new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) reject(err);
            resolve(path);
        });
    });

module.exports = { unlinkPromise };
