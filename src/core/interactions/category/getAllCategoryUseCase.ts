import { Category } from "../../entities/category";
import { CategoryRepository } from "../repositories/categoryRepository";
import { reverseFormatted } from "../../entities/formatted";

export type Request = {
    title: string,
    icon: string
} 

export interface IGetAllCategoryUseCase {
    execute(): void;
}

export interface IGetAllCategoryUseCaseResponse {
    success(categories: Category[]): void;
    fail(err: Error): void;
}

export class GetAllCategoryUseCase implements IGetAllCategoryUseCase {
    private repository: CategoryRepository;
    private presenter: IGetAllCategoryUseCaseResponse;

    constructor(repo: CategoryRepository, presenter: IGetAllCategoryUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(): Promise<void> {
        try {
            let results = await this.repository.get_all();

            // TODO: Data transfert a implement
            let categories: Category[] = [];
            for (let result of results) {
                result.title = reverseFormatted(result.title);
                categories.push(result);
            }
            this.presenter.success(categories);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}