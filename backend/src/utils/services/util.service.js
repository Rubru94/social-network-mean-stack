'use strict';

function isEmptyObject(value) {
    return value && Object.keys(value).length === 0 && value.constructor === Object;
}

function strToBoolean(stringValue) {
    switch (stringValue?.toLowerCase()?.trim()) {
        case 'true':
        case 'yes':
        case '1':
            return true;

        case 'false':
        case 'no':
        case '0':
        case null:
        case undefined:
            return false;

        default:
            return JSON.parse(stringValue);
    }
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

module.exports = { isEmptyObject, strToBoolean, findValue };
