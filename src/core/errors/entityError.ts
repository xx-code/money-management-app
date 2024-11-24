export default class EntityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EntityError';
        this.cause = 'Can\'t create entity verify mapping or interaction creation';
    }
}