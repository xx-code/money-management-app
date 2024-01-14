import { Category } from "../../entities/category";
import { Tag } from "../../entities/tag";
import { NotFoundError } from "../errors/notFoundError";
import { CategoryRepository } from "../repositories/categoryRepository";

export interface IGetCategoryUseCase {
    execute(title: string): Category;
}

export class GetCategoryUseCase implements IGetCategoryUseCase {
    private repository: CategoryRepository;

    constructor(repo: CategoryRepository) {
        this.repository = repo;
    }

    execute(title: string): Category {
        try {
            let category = this.repository.get(title);
            if (category == null) {
                throw new NotFoundError('Category no found');
            }
            return {
                title: category.title,
                icon: category.icon
            };
        } catch(err) {
            throw err;
        }
    }
}