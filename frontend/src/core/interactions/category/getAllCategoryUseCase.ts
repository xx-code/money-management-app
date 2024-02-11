import { Category } from "../../entities/category";
import { CategoryRepository } from "../repositories/categoryRepository";
import { reverseFormatted } from "../../../lib/formatted";

export type Request = {
    title: string,
    icon: string
} 

export interface IGetAllUseCase {
    execute(): Array<Category>;
}

export class GetAllCategoryUseCase implements IGetAllUseCase {
    private repository: CategoryRepository;

    constructor(repo: CategoryRepository) {
        this.repository = repo;
    }

    execute(): Category[] {
        try {
            let results = this.repository.get_all();

            for(let i = 0; i < results.length; i++) {
                results[i].title = reverseFormatted(results[i].title);
            }

            return results;
        } catch(err) {
            throw err;
        }
    }
}