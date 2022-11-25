'use strict';

const error = require('@core/models/error.model');
const moment = require('moment');
const jwtService = require('@utils/services/jwt.service');

const ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) throw new error.ForbiddenError('Authorization header does not exist');
    /**
     * @info RegExp for removing [' ""] from complete header string
     */
    const token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        const payload = jwtService.decodeToken(token);
        if (payload.exp <= moment().unix()) throw new error.UnauthorizedError('Token has expired');
        /**
         * @info inject payload in request
         */
        req.user = payload;
    } catch (err) {
        throw new error.NotFoundError(`Invalid token: ${err}`);
    }

    next();
};

module.exports = ensureAuth;
