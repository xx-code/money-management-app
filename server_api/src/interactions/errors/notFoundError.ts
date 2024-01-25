export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NoFoundError';
        this.cause = 'Can\'t found item in data';
    }
}