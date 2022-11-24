const httpStatusCodes = require('http-status-codes');
const http2 = require('http2');

class CustomError extends Error {
    error;
    statusCode;

    constructor(error) {
        super();
        this.statusCode = error?.statusCode ?? http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
        this.error = error?.error ?? error?.message ?? 'Unhandled error';
    }
}

class BadRequestError extends CustomError {
    /**
     * @status 400
     * @param message (Optional) Specify error message
     */
    constructor(message) {
        super({ statusCode: http2.constants.HTTP_STATUS_BAD_REQUEST, error: message ?? httpStatusCodes.ReasonPhrases.BAD_REQUEST });
    }
}

class NotFoundError extends CustomError {
    /**
     * @status 404
     * @param message (Optional) Specify error message
     */
    constructor(message) {
        super({ statusCode: http2.constants.HTTP_STATUS_NOT_FOUND, error: message ?? httpStatusCodes.ReasonPhrases.NOT_FOUND });
    }
}

module.exports = {
    CustomError,
    BadRequestError,
    NotFoundError
};
