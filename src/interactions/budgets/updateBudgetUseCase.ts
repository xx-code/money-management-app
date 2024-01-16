import { BudgetWithCategoryDisplay, BudgetWithTagDisplay, Period } from "../../entities/budget";
import { NotFoundError } from "../errors/notFoundError";
import { ValidationError } from "../errors/validationError";
import { BudgetRepository } from "../repositories/budgetRepository";
import { is_empty } from "../utils/verify_empty_value";

export type ReqeustUpdateTagBudget = {
    id: string;
    title: string|null;
    target: number|null;
    date_start: Date|null;
    date_end: Date|null;
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
    execute(request: RequestpdateCategoryBudget|ReqeustUpdateTagBudget): BudgetWithCategoryDisplay | BudgetWithTagDisplay
}

export class UpdateBudgetCategoryUseCase implements IUpdateBudgetUseCase {
    private repository: BudgetRepository;

    constructor(repo: BudgetRepository) {
        this.repository = repo;
    }

    execute(request: RequestpdateCategoryBudget): BudgetWithCategoryDisplay {
        try { 
            let budget = this.repository.get(request.id);

            if (budget == null) {
                throw new NotFoundError('Budget not found');
            }

            if (request.title != null) {
                if (is_empty(request.title)) {
                    throw new ValidationError('Title field is empty');
                }
            }

            if (request.target != null) {
                if (request.target <= 0) {
                    throw new ValidationError('Target price must be greather than 0');
                }
            }

            if (request.period_time != null) {
                if (request.period_time <= 0) {
                    throw new ValidationError('Period time must be greather than 0');
                }
            }

            if (request.categories != null) {
                if (request.categories.length <= 0){
                    throw new ValidationError('Budget categories must have at least 1 value');
                } 
            }

            let response = this.repository.update_category({
                id: request.id,
                title: request.title,
                target: request.target,
                period: request.period,
                period_time: request.period_time,
                categories: request.categories
            });

            return response;
        } catch(err) {
            throw err;
        }
    }
}

export class UpdateBudgetTagUseCase implements IUpdateBudgetUseCase {
    private repository: BudgetRepository;

    constructor(repo: BudgetRepository) {
        this.repository = repo;
    }

    execute(request: ReqeustUpdateTagBudget): BudgetWithTagDisplay {
        try {
            let budget = this.repository.get(request.id);

            if (budget == null) {
                throw new NotFoundError('Budget not found');
            }

            if (request.title != null) {
                if (request.title.replace(' ', '').length == 0) {
                    throw new ValidationError('Title field is empty');
                }
            }

            if (request.target != null) {
                if (request.target <= 0) {
                    throw new ValidationError('Target price must be greather than 0');
                }
            }

            if (request.date_end != null && request.date_start != null) {
                if (request.date_start >= request.date_end) {
                    throw new ValidationError('Date start must be inferiour at Date of end');
                }
            }

            if (request.tags != null) {
                if (request.tags.length <= 0){
                    throw new ValidationError('Tags must have at least 1 value');
                } 
            }

            let response = this.repository.update_tag({
                id: request.id,
                title: request.title,
                target: request.target,
                date_start: request.date_start,
                date_end: request.date_end,
                tags: request.tags
            });

            return response;
        } catch(err) {
            throw err;
        }
    }
}