import { ValidationError } from "../errors/validationError";
import { TagRepository } from "../repositories/tagRepository";
import { formatted } from "../utils/formatted";
import { is_empty } from "../utils/verify_empty_value";

export interface ICreationTagUseCase {
    execute(title: string): string;
}

export class CreationTagUseCase implements ICreationTagUseCase {
    private repository: TagRepository;

    constructor(repo: TagRepository) {
        this.repository = repo;
    }

    execute(title: string): string {
        try {
            if (is_empty(title)) {
                throw new ValidationError('Title field empty');
            }

            title = formatted(title);

            let tag = this.repository.get(title);

            if (tag != null) {
                throw new ValidationError('This category is already use');
            }

            let response = this.repository.save({
                title: title 
            });

            return response;
        } catch (err) {
            throw err;
        }
    }
}