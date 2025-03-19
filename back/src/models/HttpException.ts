export default class HttpException extends Error {
    errorCode = 200;
    internalLog = false;

    constructor(
        errorCode: number,
        message?: object | string,
        internalLog = false
    ) {
        super(JSON.stringify(message));
        this.errorCode = errorCode;
        this.internalLog = internalLog;
    }
}