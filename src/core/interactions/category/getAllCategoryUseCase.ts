import { CategoryRepository } from "../../repositories/categoryRepository";

export type CategoryResponse = {
    category_id: string
    title: string
    icon: string
    color: string|null 
}

export interface IGetAllCategoryUseCase {
    execute(): void
}

export interface IGetAllCategoryUseCaseResponse {
    success(categories: CategoryResponse[]): void;
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
            let results = await this.repository.getAll();

            let categories: CategoryResponse[] = [];
            for (let result of results) {
                categories.push({
                    category_id: result.id,
                    title: result.getTitle(),
                    color: result.color,
                    icon: result.icon
                });
            }
            this.presenter.success(categories);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}