class HttpException extends Error {
    constructor(
        errorCode,
        message,
        internalLog = false
    ) {
        super(JSON.stringify(message));
        this.errorCode = errorCode;
        this.internalLog = internalLog;
    }
}

module.exports = HttpException;