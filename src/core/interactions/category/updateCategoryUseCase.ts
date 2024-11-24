import { formatted, reverseFormatted } from "@/core/entities/formatted";
import { NotFoundError } from "@/core/errors/notFoundError";
import { CategoryRepository, dbCategory } from "../../repositories/categoryRepository";
import { Category } from "@/core/entities/category";

export interface IUpdateCategoryUseCase {
    execute(category: Category): void;
}

export interface IUpdateCategoryUseCaseResponse {
    success(is_updated: boolean): void;
    fail(err: Error): void;
}

export class UpdateCategoryUseCase implements IUpdateCategoryUseCase {
    private repository: CategoryRepository;
    private presenter: IUpdateCategoryUseCaseResponse;

    constructor(repo: CategoryRepository, presenter: IUpdateCategoryUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(request_category: Category): Promise<void> {
        try {
            let category = await this.repository.get(request_category.id);
            if (category == null) {
                throw new NotFoundError('Category no found');
            }
            request_category.title = formatted(request_category.title);

            category.title = request_category.title;
            category.icon = request_category.icon;

            let is_updated = await this.repository.update(<dbCategory>category);
            this.presenter.success(is_updated);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}