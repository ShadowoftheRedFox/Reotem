class HttpException extends Error {
    constructor(
        errorCode,
        message,
    ) {
        super(JSON.stringify(message));
        this.errorCode = errorCode;
    }
}

export default HttpException;