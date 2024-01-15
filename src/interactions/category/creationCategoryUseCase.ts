import { ValidationError } from "../errors/validationError";
import { CategoryRepository } from "../repositories/categoryRepository";

export type Request = {
    title: string,
    icon: string
} 

export interface ICreationCategoryUseCase {
    execute(request: Request): string;
}

export class CreationCategoryUseCase implements ICreationCategoryUseCase {
    private repository: CategoryRepository;

    constructor(repo: CategoryRepository) {
        this.repository = repo;
    }

    execute(request: Request): string {
        try {

            if (request.title.replace(' ', '').length == 0) {
                throw new ValidationError('Title field empty');
            }

            if (request.icon.replace(' ', '').length == 0) {
                throw new ValidationError('Icon field empty');
            }

            let category = this.repository.get(request.title);

            if (category != null) {
                throw new ValidationError('This category is already use');
            }

            let response = this.repository.save({
                title: request.title,
                icon: request.icon
            });

            return response;
        } catch (err) {
            throw err;
        }
    }
}