import { ValidationError } from "../errors/validationError";
import { TagRepository } from "../repositories/tagRepository";

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
            if (title.replace(' ', '').length == 0) {
                throw new ValidationError('Title field empty');
            }

            let category = this.repository.get(title);

            if (category != null) {
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