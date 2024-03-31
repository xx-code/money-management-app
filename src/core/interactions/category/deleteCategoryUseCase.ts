import { NotFoundError } from "../../errors/notFoundError";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted } from "../../entities/formatted";

export interface IDeleteCategoryUseCase {
    execute(title: string): void;
}

export interface IDeleteCategoryUseCaseResponse {
    success(is_deleted: boolean): void;
    fail(err: Error): void;
}

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase {
    private repository: CategoryRepository;
    private presenter: IDeleteCategoryUseCaseResponse;
    
    constructor(repo: CategoryRepository, presenter: IDeleteCategoryUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(title: string): Promise<void> {
        try {
            title = formatted(title);
            let category = await this.repository.get(title);
            
            if (category == null) {
                throw new NotFoundError('Category not found');
            }

            let is_deleted = await this.repository.delete(title);
     
            this.presenter.success(is_deleted);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}