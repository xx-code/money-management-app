import { NotFoundError } from "../../errors/notFoundError";
import { CategoryRepository } from "../../repositories/categoryRepository";

export interface IGetCategoryUseCase {
    execute(id: string): void;
}

export type CategoryResponse = {
    category_id: string
    title: string
    icon: string
    color: string|null 
}

export interface IGetCategoryUseCaseResponse {
    success(category: CategoryResponse): void;
    fail(err: Error): void;
}

export class GetCategoryUseCase implements IGetCategoryUseCase {
    private repository: CategoryRepository;
    private presenter: IGetCategoryUseCaseResponse;

    constructor(repo: CategoryRepository, presenter: IGetCategoryUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(id: string): Promise<void> {
        try {
            let category = await this.repository.get(id);
            if (category == null) {
                throw new NotFoundError('Category no found');
            }
            
            this.presenter.success({
                category_id: category.id,
                icon: category.icon,
                title: category.getTitle(),
                color: category.color
            });
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}