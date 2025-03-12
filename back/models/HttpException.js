class HttpException extends Error {
    constructor(
        errorCode,
        message,
    ) {
        super(message);
        this.errorCode = errorCode;
    }
}

export default HttpException;