import { CustomError, ForbiddenError, UnauthorizedError } from '@core/models/error.model';
import jwtService from '@utils/services/jwt.service';
import { NextFunction, Request, Response } from 'express';
import httpContext from 'express-http-context';
import moment from 'moment';

const ensureAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) throw new ForbiddenError('Authorization header does not exist');
        /**
         * @info RegExp for removing [' ""] from complete header string
         */
        const token = req.headers.authorization.replace(/['"]+/g, '');
        const payload = await jwtService.decodeToken(token);
        if (payload.exp <= moment().unix()) throw new UnauthorizedError('Token has expired');

        /**
         * @info inject payload in request
         */
        httpContext.set('user', payload);
    } catch (error) {
        next(new CustomError(error));
    }

    next();
};

export default ensureAuth;
