import { NotFoundError } from "../../errors/notFoundError";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted } from "../../../lib/formatted";

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
            title = formatted(title);
            let category = this.repository.get(title);

            if (category == null) {
                throw new NotFoundError('Category not found');
            }

            let response = this.repository.delete(title);
            return response;
        } catch(err) {
            throw err;
        }
    }
}