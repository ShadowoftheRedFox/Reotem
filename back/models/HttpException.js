class HttpException extends Error {
    constructor(
        errorCode,
        message,
    ) {
        super(JSON.stringify(message));
        this.errorCode = errorCode;
    }
}

module.exports = HttpException;