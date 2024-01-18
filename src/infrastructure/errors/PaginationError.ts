export class PaginationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PaginationError';
        this.cause = 'page index out';
    }
}