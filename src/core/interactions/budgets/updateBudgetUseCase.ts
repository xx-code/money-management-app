import { BudgetDisplay, Period, determined_start_end_date_budget } from "../../entities/budget";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { BudgetRepository } from "../repositories/budgetRepository";
import { is_empty } from "../../entities/verify_empty_value";
import { TransactionRepository } from "../repositories/transactionRepository";
import { TagRepository } from "../repositories/tagRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted, reverseFormatted } from "../../../core/entities/formatted";
import DateParser from "@/core/entities/date_parser";
import { determined_end_date_with } from "@/core/entities/future_transaction";

export type RequestUpdateBudget = {
    id: string;
    title: string|null;
    target: number|null;
    is_archived: boolean|null;
    date_start: string|null;
    date_end: string|null;
    period: Period|null;
    period_time: number|null;
    tags: Array<string>|null;
    categories: Array<string>|null;
}


export interface IUpdateBudgetUseCase {
    execute(request: RequestUpdateBudget): void
}

export interface IUpdateBudgetUseCaseResponse {
    success(budget: BudgetDisplay): void;
    fail(err: Error): void;
}

export class UpdateBudgetCategoryUseCase implements IUpdateBudgetUseCase {
    private budget_repository: BudgetRepository;
    private category_repository: CategoryRepository;
    private transaction_repository: TransactionRepository;
    private tag_repository: TagRepository;
    private presenter: IUpdateBudgetUseCaseResponse;

    constructor(budget_repository: BudgetRepository, transaction_repository: TransactionRepository, category_repository: CategoryRepository, tag_repository: TagRepository, presenter: IUpdateBudgetUseCaseResponse) {
        this.budget_repository = budget_repository;
        this.tag_repository = tag_repository;
        this.category_repository = category_repository;
        this.transaction_repository = transaction_repository;
        this.presenter = presenter;
    }

    async execute(request: RequestUpdateBudget): Promise<void> {
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

            if (request.is_archived !== null) {
                budget.is_archived = request.is_archived
            }

            if (request.categories != null) {
                if (request.categories.length <= 0){
                    throw new ValidationError('Budget categories must have at least 1 value');
                }
             
                for (let i = 0; i < request.categories.length; i++) {
        
                    let category = await this.category_repository.get(request.categories[i]);
                    if (category == null) {
                        throw new ValidationError('This category not exist');
                    }

                    if (!budget.categories.map(cat => cat.id).includes(category.id!)) {
                        budget.categories.push(category!);
                    } else {
                        let index_to_delete = budget.categories.map(cat => cat.id).indexOf(category.id);
                        budget.categories.splice(index_to_delete, 1);
                    }
                }
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

            let date_start: DateParser = budget.date_start
            console.log(request.date_start)
            if (request.date_start !== null && request.date_start !== undefined) {
                
                date_start = DateParser.from_string(request.date_start)
                budget.date_to_update = determined_end_date_with(date_start.toDate(), budget.period!, budget.period_time!);
            }

            let categories_ref = budget.categories.map(cat => cat.id);
            
            let budget_updated = await this.budget_repository.update({
                id: budget.id,
                title: budget.title,
                target: budget.target,
                period: budget.period,
                is_archived: budget.is_archived,
                period_time: budget.period_time,
                date_to_update: budget.date_to_update,
                date_start: date_start,
                categories: categories_ref,
                is_periodic: false,
                date_end: null,
                tags: budget.tags.map(tag => formatted(tag))
            });

            let current_date_budget = determined_start_end_date_budget(budget.period!, budget.period_time!)

            let start_date = current_date_budget.start_date;
            let end_date = current_date_budget.end_date;

            let balance = await this.transaction_repository.get_balance({
                categories: budget.categories.map(cat => cat.id),
                accounts: [],
                tags: [],
                type: null,
                start_date: start_date,
                end_date: end_date,
                price: null
            });

            let budget_display: BudgetDisplay = {
                id: budget_updated.id,
                title: budget_updated.title,
                categories: budget_updated.categories,
                current: balance,
                date_start: budget.date_start,
                date_to_update: budget.date_to_update,
                period: budget_updated.period,
                period_time: budget_updated.period_time,
                target: budget_updated.target,
                is_periodic: false,
                date_end: null,
                tags: budget_updated.tags.map(tag => reverseFormatted(tag))
            };

            this.presenter.success(budget_display);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}