export class ErrorController {
    error: Error;
    code: number;

    constructor(error: Error, code: number) {
        this.error = error;
        this.code = code;
    }
}