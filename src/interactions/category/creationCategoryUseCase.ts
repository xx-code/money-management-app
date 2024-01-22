import { ValidationError } from "../errors/validationError";
import { CategoryRepository } from "../repositories/categoryRepository";
import { is_empty } from "../utils/verify_empty_value";

export type RequestCreationCategoryUseCase = {
    title: string,
    icon: string
} 

export interface ICreationCategoryUseCase {
    execute(request: RequestCreationCategoryUseCase): string;
}

export class CreationCategoryUseCase implements ICreationCategoryUseCase {
    private repository: CategoryRepository;

    constructor(repo: CategoryRepository) {
        this.repository = repo;
    }

    execute(request: RequestCreationCategoryUseCase): string {
        try {

            if (is_empty(request.title)) {
                throw new ValidationError('Title field empty');
            }

            if (is_empty(request.icon)) {
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