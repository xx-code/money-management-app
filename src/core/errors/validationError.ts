export default class ValidationError extends Error {
    public code: number|undefined;
    
    constructor(message: string, code:number|undefined = undefined) {
        super(message)
        this.name = "ValidationError";
        this.cause = "InputData";
        this.code = code;
    }
}