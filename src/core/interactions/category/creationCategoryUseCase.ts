import { ValidationError } from "../../errors/validationError";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted } from "../../entities/formatted";
import { is_empty } from "../../entities/verify_empty_value";

export type RequestCreationCategoryUseCase = {
    title: string,
    icon: string
} 

export interface ICreationCategoryUseCase {
    execute(request: RequestCreationCategoryUseCase): void;
}

export interface ICreationCategoryUseCaseResponse {
    success(title: string): void;
    fail(err: Error): void;
}

export class CreationCategoryUseCase implements ICreationCategoryUseCase {
    private repository: CategoryRepository;
    private presenter: ICreationCategoryUseCaseResponse;

    constructor(repo: CategoryRepository, presenter: ICreationCategoryUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    execute(request: RequestCreationCategoryUseCase): void {
        try {
            if (is_empty(request.title)) {
                throw new ValidationError('Title field empty');
            }

            if (is_empty(request.icon)) {
                throw new ValidationError('Icon field empty');
            }

            let category = this.repository.get(formatted(request.title));

            if (category != null) {
                throw new ValidationError('This category is already use');
            }

            let response = this.repository.save({
                title: formatted(request.title),
                icon: request.icon
            });

            this.presenter.success(response);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}