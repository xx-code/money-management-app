import { Category } from "../../entities/category";
import { NotFoundError } from "../../errors/notFoundError";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted, reverseFormatted } from "../../../lib/formatted";

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
            title = formatted(title);
            let category = this.repository.get(title);
            if (category == null) {
                throw new NotFoundError('Category no found');
            }
            return {
                title: reverseFormatted(category.title),
                icon: category.icon
            };
        } catch(err) {
            throw err;
        }
    }
}