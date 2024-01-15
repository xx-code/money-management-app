import { Category } from "../../entities/category";
import { CategoryRepository } from "../repositories/categoryRepository";

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
            let use_case = this.repository.get_all();

            return use_case;
        } catch(err) {
            throw err;
        }
    }
}