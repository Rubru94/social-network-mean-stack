import { ForbiddenError, NotFoundError, UnauthorizedError } from '@core/models/error.model';
import jwtService from '@utils/services/jwt.service';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

const ensureAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) throw new ForbiddenError('Authorization header does not exist');
    /**
     * @info RegExp for removing [' ""] from complete header string
     */
    const token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        const payload = await jwtService.decodeToken(token);
        if (payload.exp <= moment().unix()) throw new UnauthorizedError('Token has expired');
        /**
         * @info inject payload in request
         */
        req.user = payload;
    } catch (err) {
        throw new NotFoundError(`Invalid token: ${err}`);
    }

    next();
};

module.exports = ensureAuth;
