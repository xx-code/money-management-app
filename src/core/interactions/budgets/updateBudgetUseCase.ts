import { BudgetWithCategoryDisplay, BudgetWithTagDisplay, Period, compute_current_spend, determined_start_end_date_budget } from "../../entities/budget";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { BudgetCategoryRepository, BudgetTagRepository } from "../repositories/budgetRepository";
import { is_empty } from "../../entities/verify_empty_value";
import { TransactionRepository } from "../repositories/transactionRepository";
import { TagRepository } from "../repositories/tagRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted } from "../../../core/entities/formatted";
import DateParser from "@/core/entities/date_parser";

export type RequestUpdateTagBudget = {
    id: string;
    title: string|null;
    target: number|null;
    date_start: DateParser|null;
    date_end: DateParser|null;
    tags: Array<string>|null;
}

export type RequestpdateCategoryBudget = {
    id: string;
    title: string|null;
    target: number|null;
    period: Period|null;
    period_time: number|null;
    categories: Array<string>|null;
}

export interface IUpdateBudgetUseCase {
    execute(request: RequestpdateCategoryBudget|RequestUpdateTagBudget): void
}

export interface IUpdateBudgetUseCaseResponse {
    success(budget: BudgetWithCategoryDisplay | BudgetWithTagDisplay): void;
    fail(err: Error): void;
}

export class UpdateBudgetCategoryUseCase implements IUpdateBudgetUseCase {
    private budget_repository: BudgetCategoryRepository;
    private category_repository: CategoryRepository;
    private transaction_repository: TransactionRepository;
    private presenter: IUpdateBudgetUseCaseResponse;

    constructor(budget_repository: BudgetCategoryRepository, transaction_repository: TransactionRepository, category_repository: CategoryRepository, presenter: IUpdateBudgetUseCaseResponse) {
        this.budget_repository = budget_repository;
        this.category_repository = category_repository;
        this.transaction_repository = transaction_repository;
        this.presenter = presenter;
    }

    async execute(request: RequestpdateCategoryBudget): Promise<void> {
        try { 
            let budget = await this.budget_repository.get(request.id);

            if (budget == null) {
                throw new NotFoundError('Budget not found');
            }

            if (request.title != null) {
                if (is_empty(request.title)) {
                    throw new ValidationError('Title field is empty');
                }
                budget.title = request.title;
            }

            if (request.target != null) {
                if (request.target <= 0) {
                    throw new ValidationError('Target price must be greather than 0');
                }
                budget.target = request.target;
            }

            if (request.period_time != null) {
                if (request.period_time <= 0) {
                    throw new ValidationError('Period time must be greather than 0');
                }
                budget.period_time = request.period_time;
            }

            if (request.period != null) {
                const period_list = ['Month', 'Week' , 'Year']
                if (!period_list.includes(request.period)) {
                    throw new ValidationError('Period must be Week, Month or year');
                }
                budget.period = request.period;
            }

            if (request.categories != null) {
                if (request.categories.length <= 0){
                    throw new ValidationError('Budget categories must have at least 1 value');
                }
             
                for (let i = 0; i < request.categories.length; i++) {
                    let category = await this.category_repository.get(formatted(request.categories[i]));
                    if (category == null) {
                        throw new ValidationError('This category not exist');
                    }

                    if (!budget.categories.map(cat => cat.title).includes(category.title!)) {
                        budget.categories.push(category!);
                    } else {
                        let index_to_delete = budget.categories.map(cat => cat.title).indexOf(category.title);
                        budget.categories.splice(index_to_delete, 1);
                    }
                }
            }

            let categories_ref = budget.categories.map(cat => cat.title);
            
            let budget_updated = await this.budget_repository.update({
                id: budget.id,
                title: budget.title,
                target: budget.target,
                period: budget.period,
                period_time: budget.period_time,
                categories: categories_ref
            });

            let current_date_budget = determined_start_end_date_budget(budget)

            let start_date = current_date_budget.start_date;
            let end_date = current_date_budget.end_date;

            let balance = await this.transaction_repository.get_balance({
                categories: budget.categories.map(cat => cat.title),
                accounts: [],
                tags: [],
                type: null,
                start_date: start_date,
                end_date: end_date,
                price: null
            });

            let budget_display: BudgetWithCategoryDisplay = {
                id: budget_updated.id,
                title: budget_updated.title,
                categories: budget_updated.categories,
                current: balance,
                period: budget_updated.period,
                period_time: budget_updated.period_time,
                target: budget_updated.target
            };


            this.presenter.success(budget_display);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}

export class UpdateBudgetTagUseCase implements IUpdateBudgetUseCase {
    private budget_repository: BudgetTagRepository;
    private transaction_repository: TransactionRepository;
    private tag_repository: TagRepository;
    private presenter: IUpdateBudgetUseCaseResponse;

    constructor(budget_repository: BudgetTagRepository, transaction_repository: TransactionRepository, presenter: IUpdateBudgetUseCaseResponse, tag_repository: TagRepository) {
        this.budget_repository = budget_repository;
        this.transaction_repository = transaction_repository;
        this.tag_repository = tag_repository;
        this.presenter = presenter;
    }

    //TODO: check tag creation 
    async execute(request: RequestUpdateTagBudget): Promise<void> {
        try {
            let budget = await this.budget_repository.get(request.id);

            if (budget == null) {
                throw new NotFoundError('Budget not found');
            }

            if (request.title != null) {
                if (request.title.replace(' ', '').length == 0) {
                    throw new ValidationError('Title field is empty');
                }
                budget.title = request.title;
            }

            if (request.target != null) {
                if (request.target <= 0) {
                    throw new ValidationError('Target price must be greather than 0');
                }
                budget.target = request.target;
            }

            if ( request.date_end != null && request.date_start != null) {
                if (request.date_start >= request.date_end) {
                    throw new ValidationError('Date start must be inferiour at Date of end');
                }
                budget.date_start = request.date_start;
                budget.date_end = request.date_end;
            }

            if (request.tags != null) {
                if (request.tags.length <= 0){
                    throw new ValidationError('Tags must have at least 1 value');
                } 
                for (let i = 0; i < request.tags.length; i++) {
                    let tag = await this.tag_repository.get(request.tags[i]);
                    if (tag == null) {
                        await this.tag_repository.save({title: formatted(request.tags[i]) });
                        budget.tags.push(request.tags[i]);
                    }
                }
            }

            let balance = await this.transaction_repository.get_balance({
                categories: [],
                accounts: [],
                tags: budget.tags,
                type: null,
                start_date: budget.date_start,
                end_date: budget.date_end,
                price: null
            });

            let budget_updated = await this.budget_repository.update(budget);

            let budget_display: BudgetWithTagDisplay = {
                id: budget_updated.id,
                title: budget_updated.title,
                current: balance,
                date_start: budget_updated.date_start,
                date_end: budget_updated.date_end,
                target: budget_updated.target,
                tags: budget_updated.tags
            };

            this.presenter.success(budget_display);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}