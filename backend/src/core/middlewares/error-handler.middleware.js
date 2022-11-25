'use strict';

const http2 = require('http2');
const error = require('@core/models/error.model');

/**
 * Custom error handler
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
const handleError = (err, req, res, next) => {
    if (res.headersSent) return;
    if (!(err instanceof error.CustomError)) err = new error.CustomError(err);
    let status;
    if (err.statusCode) status = err.statusCode;
    res.status(status ?? http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(err);
};

module.exports = handleError;
