import { Category } from "../../entities/category";
import { NotFoundError } from "../../errors/notFoundError";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted, reverseFormatted } from "../../entities/formatted";

export interface IGetCategoryUseCase {
    execute(title: string): void;
}

export interface IGetCategoryUseCaseResponse {
    success(category: Category): void;
    fail(err: Error): void;
}

export class GetCategoryUseCase implements IGetCategoryUseCase {
    private repository: CategoryRepository;
    private presenter: IGetCategoryUseCaseResponse;

    constructor(repo: CategoryRepository, presenter: IGetCategoryUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    execute(title: string): void {
        try {
            title = formatted(title);
            let category = this.repository.get(title);
            if (category == null) {
                throw new NotFoundError('Category no found');
            }
            
            this.presenter.success(category);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}