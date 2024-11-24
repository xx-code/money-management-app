import { Period, determined_start_end_date_budget } from "../../entities/budget";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { BudgetRepository } from "../../repositories/budgetRepository";
import { is_empty } from "../../entities/verify_empty_value";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { TagRepository } from "../../repositories/tagRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
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
    period: string|null;
    period_time: number|null;
    tags: Array<string>|null;
    categories: Array<string>|null;
}

export type BudgetCategoryOutput = {
    id: string
    title: string
    icon: string
}

export type BudgetOutput = {
    id: string,
    title: string,
    target: number,
    categories: BudgetCategoryOutput[],
    tags: string[]
    period: string|null
    period_time: number
    currentBalance: number
    start_date: string
    update_date: string
    end_date: string|null
}


export interface IUpdateBudgetUseCase {
    execute(request: RequestUpdateBudget): void
}

export interface IUpdateBudgetUseCaseResponse {
    success(budget: BudgetOutput): void;
    fail(err: Error): void;
}

export class UpdateBudgetUseCase implements IUpdateBudgetUseCase {
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
                if (request.period_time < 0) {
                    throw new ValidationError('Period time must be greather than 0');
                }
                budget.period_time = request.period_time;
            }

            if (request.period != null) {
                const period_list = ['Month', 'Week' , 'Year']
                if (!period_list.includes(request.period)) {
                    throw new ValidationError('Period must be Week, Month or year');
                }
                budget.period = <Period>request.period;
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

                    if (!budget.categories.includes(category.id!)) {
                        budget.categories.push(category.id!);
                    } else {
                        let index_to_delete = budget.categories.indexOf(category.id);
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

           
            if (request.date_end !== null && request.date_end !== undefined) {
                let date_end = DateParser.from_string(request.date_end)
                budget.date_end = date_end
            }

            if (request.date_start !== null && request.date_start !== undefined) {
                let date_start = DateParser.from_string(request.date_start)
                budget.date_start = date_start
                if (budget.period !== null && budget.period_time > 0) {
                    budget.date_update = determined_end_date_with(date_start.toDate(), budget.period!, budget.period_time!);
                } else {
                    if (!budget.date_end) {
                        throw new ValidationError('this format of budget is impossible set at less a date end')
                    }
                    budget.date_update = budget.date_end
                }
            }

            
            let budget_updated = await this.budget_repository.update(budget);

            let start_date = budget_updated.date_start;
            let end_date = budget_updated.date_update;

            if (budget.period)  {
                let current_date_budget = determined_start_end_date_budget(budget.period!, budget.period_time!)
                start_date = current_date_budget.start_date
                end_date = current_date_budget.end_date
                if (budget.date_end && end_date.compare(budget.date_end) < 0)
                    end_date = budget.date_end
            }

            let categories: BudgetCategoryOutput[] =  [] 
            for(let category_id of budget.categories) {
                let category = await this.category_repository.get(category_id)
                if (category !== null)
                    categories.push({id: category.id, title: category.title, icon: category.icon})
            }

            let balance = await this.transaction_repository.get_balance({
                categories: budget.categories,
                accounts: [],
                tags: [],
                type: null,
                start_date: start_date,
                end_date: end_date,
                price: null
            });

            let budget_display: BudgetOutput = {
                id: budget.id,
                title: budget.title,
                categories: categories,
                currentBalance: Math.abs(balance),
                period: budget.period,
                period_time: budget.period_time,
                target: budget.target,
                start_date: budget.date_start.toString(),
                update_date: budget.date_update.toString(),
                end_date: budget.date_end ? budget.date_end.toString() : null,
                tags: budget.tags.map((tag => reverseFormatted(tag)))
            };

            this.presenter.success(budget_display);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}