import { ValidationError } from "../errors/validationError";
import { TagRepository } from "../repositories/tagRepository";

export interface IDeleteTagUseCase {
    execute(title: string): boolean;
}

export class DeleteTagUseCase implements IDeleteTagUseCase {
    private repository: TagRepository;
    
    constructor(repo: TagRepository) {
        this.repository = repo;
    }

    execute(title: string): boolean {
        try {
            let tag = this.repository.get(title);

            if (tag == null) {
                throw new ValidationError('Tag not found');
            }

            let response = this.repository.delete(title);
            return response;
        } catch(err) {
            throw err;
        }
    }
}