import { NotFoundError } from "../../errors/notFoundError";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted } from "../../entities/formatted";

export interface IDeleteCategoryUseCase {
    execute(title: string): void;
}

export interface IDeleteCategoryUseCaseResponse {
    success(title: string): void;
    fail(err: Error): void;
}

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase {
    private repository: CategoryRepository;
    private presenter: IDeleteCategoryUseCaseResponse;
    
    constructor(repo: CategoryRepository, presenter: IDeleteCategoryUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    execute(title: string): void {
        try {
            title = formatted(title);
            let category = this.repository.get(title);

            if (category == null) {
                throw new NotFoundError('Category not found');
            }

            let response = this.repository.delete(title);
            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}