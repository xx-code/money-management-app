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

            this.presenter.success(results);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}