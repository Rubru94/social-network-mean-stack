import { CustomError } from '@core/models/error.model';
import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';

/**
 * Custom error handler
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
const handleError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return;
    if (!(err instanceof CustomError)) err = new CustomError(err);
    res.status(err.statusCode ?? constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(err);
};

export default handleError;
