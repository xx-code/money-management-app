import { NotFoundError } from "../errors/notFoundError";
import { CategoryRepository } from "../repositories/categoryRepository";

export interface IDeleteCategoryUseCase {
    execute(title: string): boolean;
}

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase {
    private repository: CategoryRepository;
    
    constructor(repo: CategoryRepository) {
        this.repository = repo;
    }

    execute(title: string): boolean {
        try {
            let Category = this.repository.get(title);

            if (Category == null) {
                throw new NotFoundError('Category not found');
            }

            let response = this.repository.delete(title);
            return response;
        } catch(err) {
            throw err;
        }
    }
}