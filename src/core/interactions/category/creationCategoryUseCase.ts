import { ValidationError } from "../../errors/validationError";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { formatted } from "../../entities/formatted";
import { is_empty } from "../../entities/verify_empty_value";
import { CryptoService } from "@/core/adapters/libs";

export type RequestCreationCategoryUseCase = {
    title: string,
    icon: string
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

            if (is_empty(request.title)) {
                throw new ValidationError('Title field empty');
            }

            if (is_empty(request.icon)) {
                throw new ValidationError('Icon field empty');
            }

            let category = await this.repository.get_by_title(formatted(request.title));

            if (category != null) {
                throw new ValidationError('This category is already use');
            }

            let is_saved = await this.repository.save({
                id: id,
                title: formatted(request.title),
                icon: request.icon
            });

            if (!is_saved) {
                throw new Error('Category not save');
            }

            this.presenter.success(is_saved);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}