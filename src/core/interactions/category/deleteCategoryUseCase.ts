import { NotFoundError } from "../../errors/notFoundError";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted } from "../../entities/formatted";

export interface IDeleteCategoryUseCase {
    execute(id: string): void;
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

    async execute(id: string): Promise<void> {
        try {
            let category = await this.repository.get(id);
            
            if (category == null) {
                throw new NotFoundError('Category not found');
            }

            let is_deleted = await this.repository.delete(id);
     
            this.presenter.success(is_deleted);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}