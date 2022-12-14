import { ReasonPhrases } from 'http-status-codes';
import { constants } from 'http2';

export class CustomError extends Error {
    error: string;
    readonly statusCode: number;

    constructor(error?: Partial<CustomError>) {
        super();
        this.statusCode = error?.statusCode ?? constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
        this.error = error?.error ?? error?.message ?? 'Unhandled error';
    }
}

export class BadRequestError extends CustomError {
    /**
     * @status 400
     * @param message (Optional) Specify error message
     */
    constructor(message?: string) {
        super({ statusCode: constants.HTTP_STATUS_BAD_REQUEST, error: message ?? ReasonPhrases.BAD_REQUEST });
    }
}

export class UnauthorizedError extends CustomError {
    /**
     * @status 401
     * @param message (Optional) Specify error message
     */
    constructor(message?: string) {
        super({ statusCode: constants.HTTP_STATUS_UNAUTHORIZED, error: message ?? ReasonPhrases.UNAUTHORIZED });
    }
}

export class ForbiddenError extends CustomError {
    /**
     * @status 403
     * @param message (Optional) Specify error message
     */
    constructor(message?: string) {
        super({ statusCode: constants.HTTP_STATUS_FORBIDDEN, error: message ?? ReasonPhrases.FORBIDDEN });
    }
}

export class NotFoundError extends CustomError {
    /**
     * @status 404
     * @param message (Optional) Specify error message
     */
    constructor(message?: string) {
        super({ statusCode: constants.HTTP_STATUS_NOT_FOUND, error: message ?? ReasonPhrases.NOT_FOUND });
    }
}
