import { Period } from "../../entities/budget";
import { ValidationError } from "../../errors/validationError";
import { BudgetCategoryRepository, BudgetTagRepository } from "../repositories/budgetRepository";
import { CryptoService } from "../../adapter/libs";
import { is_empty } from "../../entities/verify_empty_value";
import { CategoryRepository } from "../repositories/categoryRepository";
import { TagRepository } from "../repositories/tagRepository";
import { formatted } from "../../../core/entities/formatted";
import DateParser from "@/core/entities/date_parser";

export type CreationBudgetCategoryUseCaseRequest = {
    title: string;
    target: number;
    period: Period;
    period_time: number;
    categories: Array<string>;
} 

export type CreationBudgetTagUseCaseRequest = {
    title: string;
    target: number;
    date_start: DateParser;
    date_end: DateParser;
    tags: Array<string>;
}

export interface ICreationBudgetUseCase {
    execute(request: CreationBudgetCategoryUseCaseRequest|CreationBudgetTagUseCaseRequest): void;
}

export interface ICreationBudgetUseCaseResponse {
    success(id: string): void;
    fail(err: Error): void;
}

export class CreationBudgetCategoryUseCase implements ICreationBudgetUseCase {
    private budget_repository: BudgetCategoryRepository;
    private category_repository: CategoryRepository;
    private presenter: ICreationBudgetUseCaseResponse;
    private crypto: CryptoService;

    constructor(budget_repository: BudgetCategoryRepository, category_repository: CategoryRepository, presenter: ICreationBudgetUseCaseResponse, crypto: CryptoService) {
        this.budget_repository = budget_repository;
        this.category_repository = category_repository;
        this.presenter = presenter;
        this.crypto = crypto;
    }

    async execute(request: CreationBudgetCategoryUseCaseRequest): Promise<void> {
        try {
            
            if (is_empty(request.title)) {
                throw new ValidationError('Title field is empty');
            }

            if (request.categories.length <= 0) {
                throw new ValidationError('Budget categories must have at least 1 value');
            }

            for (let i = 0; i < request.categories.length; i++) {
                let category = this.category_repository.get(request.categories[i]);
                if (category != null) {
                    throw new ValidationError('Category ' + request.categories[i] + ' not exist')
                }
            }

            if (request.target <= 0) {
                throw new ValidationError('Target price must be greather than 0');
            }

            if (request.period_time <= 0) {
                throw new ValidationError('Period time must be greather than 0');
            }

            let new_id = this.crypto.generate_uuid_to_string();


            let response = this.budget_repository.save({
                id: new_id,
                title: request.title,
                target: request.target,
                period: request.period,
                period_time: request.period_time,
                categories: request.categories
            });

            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}

export class CreationBudgetTagUseCase implements ICreationBudgetUseCase {
    private budget_repository: BudgetTagRepository;
    private crypto: CryptoService;
    private tag_repository: TagRepository;
    private presenter: ICreationBudgetUseCaseResponse;

    constructor(budget_repository: BudgetTagRepository, tag_repository: TagRepository, presenter: ICreationBudgetUseCaseResponse, crypto: CryptoService) {
        this.budget_repository = budget_repository;
        this.tag_repository = tag_repository;
        this.presenter = presenter;
        this.crypto = crypto;
    }

    execute(request:CreationBudgetTagUseCaseRequest): void {
        try {
            if (is_empty(request.title)) {
                throw new ValidationError('Title field is empty');
            }

            if (request.target <= 0) {
                throw new ValidationError('Target price must be greather than 0');
            }

            if (request.tags.length <= 0) {
                throw new ValidationError('Tags must have at least 1 value');
            }

            for (let i = 0; i < request.tags.length; i++) {
                let tag = this.tag_repository.get(request.tags[i]);
                if (tag != null) {
                    this.tag_repository.save({title: formatted(request.tags[i]) });
                }
            }

            if (new Date(request.date_start.toString())  >= new Date(request.date_end.toString())) {
                throw new ValidationError('Date start must be inferiour at Date of end');
            }

            let new_id = this.crypto.generate_uuid_to_string()

            let response = this.budget_repository.save({
                id: new_id,
                title: request.title,
                target: request.target,
                date_start: request.date_start,
                date_end: request.date_end,
                tags: request.tags
            });
            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}