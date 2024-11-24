import { formatted, isEmpty } from "@/core/domains/helpers";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { CryptoService } from "@/core/adapters/libs";
import ValidationError from "@/core/errors/validationError";
import { Category } from "@/core/domains/entities/category";

export type RequestCreationCategoryUseCase = {
    title: string,
    icon: string,
    color: string|null
} 

export interface ICreationCategoryUseCase {
    execute(request: RequestCreationCategoryUseCase): void;
}

export interface ICreationCategoryUseCaseResponse {
    success(is_saved: boolean): void;
    fail(err: Error): void;
}

export class CreationCategoryUseCase implements ICreationCategoryUseCase {
    private repository: CategoryRepository;
    private presenter: ICreationCategoryUseCaseResponse;
    private crypto: CryptoService;

    constructor(repo: CategoryRepository, presenter: ICreationCategoryUseCaseResponse, crypto: CryptoService) {
        this.repository = repo;
        this.presenter = presenter;
        this.crypto = crypto;
    }

    async execute(request: RequestCreationCategoryUseCase): Promise<void> {
        try {
            let id = this.crypto.generate_uuid_to_string();

            if (isEmpty(request.title)) {
                throw new ValidationError('Title field empty');
            }

            if (isEmpty(request.icon)) {
                throw new ValidationError('Icon field empty');
            }

            let category = await this.repository.getByTitle(formatted(request.title));

            if (category != null) {
                throw new ValidationError('This category is already use');
            }

            let new_category = new Category(id, request.title, request.icon)
            new_category.color = request.color

            let is_saved = await this.repository.save(new_category);

            if (!is_saved) {
                throw new Error('Category not save');
            }

            this.presenter.success(is_saved);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}