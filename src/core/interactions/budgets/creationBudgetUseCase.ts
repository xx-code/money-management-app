import { BudgetBuilder, Period } from "../../entities/budget";
import { ValidationError } from "../../errors/validationError";
import { BudgetRepository } from "../repositories/budgetRepository";
import { CryptoService } from "../../adapter/libs";
import { is_empty } from "../../entities/verify_empty_value";
import { CategoryRepository } from "../repositories/categoryRepository";
import { TagRepository } from "../repositories/tagRepository";
import { formatted } from "../../../core/entities/formatted";
import DateParser from "@/core/entities/date_parser";
import { determined_end_date_with } from "@/core/entities/future_transaction";

export type CreationBudgetUseCaseRequest = {
    title: string;
    target: number;
    period: string;
    period_time: number;
    date_start: string;
    date_end: string;
    categories: Array<string>;
    tags: Array<string>;
} 

export interface ICreationBudgetUseCase {
    execute(request: CreationBudgetUseCaseRequest): void;
}

export interface ICreationBudgetUseCaseResponse {
    success(is_save: boolean): void;
    fail(err: Error): void;
}

export class CreationBudgetUseCase implements ICreationBudgetUseCase {
    private budget_repository: BudgetRepository;
    private category_repository: CategoryRepository;
    private tag_repository: TagRepository;
    private presenter: ICreationBudgetUseCaseResponse;
    private crypto: CryptoService;

    constructor(budget_repository: BudgetRepository, category_repository: CategoryRepository, tag_repository: TagRepository, presenter: ICreationBudgetUseCaseResponse, crypto: CryptoService) {
        this.budget_repository = budget_repository;
        this.category_repository = category_repository;
        this.tag_repository = tag_repository;
        this.presenter = presenter;
        this.crypto = crypto;
    }

    async execute(request: CreationBudgetUseCaseRequest): Promise<void> {
        try {
            const budget_builder = new BudgetBuilder()

            if (is_empty(request.title)) {
                throw new ValidationError('Title field is empty');
            }
            budget_builder.setTitle(request.title)

            if (request.categories.length === 0 && request.tags.length === 0) {
                throw new ValidationError('Budget categories must have at least 1 value');
            }
            
            let categories = []
            for (let i = 0; i < request.categories.length; i++) {
                let category = await this.category_repository.get(request.categories[i]);
                if (category === null) {
                    throw new ValidationError('Category ' + request.categories[i] + ' not exist')
                }
                categories.push(category.id);
            }
            budget_builder.setCategories(categories)

            let tags = [];
            for (let i = 0; i < request.tags.length; i++) {
                let tag = await this.tag_repository.get(formatted(request.tags[i]));
                if (tag === null) {
                    let is_save = await this.tag_repository.save({title: formatted(request.tags[i]) });
                    if (!is_save)
                        throw new ValidationError('Error savegard new tag')
                }
                tags.push(formatted(request.tags[i]));
            }
            budget_builder.setTags(tags)

            if (is_empty(request.date_start)) {
                throw new ValidationError('Date start is empty')
            }
            let date_start: DateParser = DateParser.from_string(request.date_start)
            budget_builder.setDateStart(date_start)            
            
            if (request.target <= 0) {
                throw new ValidationError('Target price must be greather than 0');
            }
            budget_builder.setTarget(request.target)

            if (!is_empty(request.date_end)) {
                let date_end: DateParser = DateParser.from_string(request.date_start)
                budget_builder.setDateEnd(date_end)
            } 
            
            if (!is_empty(request.period)) {
                const period_list = ['Month', 'Week' , 'Year']
                if (!period_list.includes(request.period)) {
                    throw new ValidationError('Period must be Week, Month or year');
                }

                if (request.period_time < 0 ) {
                    throw new ValidationError('Period time must be greather than 0');
                } 
                let period: Period = <Period>request.period
                let date_to_update = determined_end_date_with(date_start.toDate(), period, request.period_time)
                budget_builder.setDateUpdate(date_to_update)
            } else {
                if (is_empty(request.date_end)) {
                    throw new ValidationError('this format of budget is impossible set at less a date end')
                }
                let date_end: DateParser = DateParser.from_string(request.date_start)
                budget_builder.setDateUpdate(date_end)
            }
            
            let new_id = this.crypto.generate_uuid_to_string();
            budget_builder.setId(new_id)

            let new_budget = budget_builder.getBudget()

            let response = await this.budget_repository.save(new_budget!);

            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}
