'use strict';

function isEmptyObject(value) {
    return value && Object.keys(value).length === 0 && value.constructor === Object;
}

function findValue(object, key) {
    let value;
    Object.keys(object).some(function (k) {
        if (k === key) {
            value = object[k];
            return true;
        }
        if (object[k] && typeof object[k] === 'object') {
            value = findValue(object[k], key);
            return value !== undefined;
        }
    });
    return value;
}

module.exports = { isEmptyObject, findValue };
