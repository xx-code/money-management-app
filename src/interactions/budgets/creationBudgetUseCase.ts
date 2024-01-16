import { Period } from "../../entities/budget";
import { ValidationError } from "../errors/validationError";
import { BudgetRepository } from "../repositories/budgetRepository";
import { Crypto } from "../utils/cryto";

export type CreationBudgetCategoryUseCaseRequest = {
    title: string;
    target: number;
    period: Period,
    period_time: number;
    categories: Array<string>;
} 

export type CreationBudgetTagUseCaseRequest = {
    title: string;
    target: number;
    date_start: Date;
    date_end: Date;
    tags: Array<string>;
}

export interface ICreationBudgetUseCase {
    execute(request: CreationBudgetCategoryUseCaseRequest|CreationBudgetTagUseCaseRequest): string;
}

export class CreationBudgetCategoryUseCase implements ICreationBudgetUseCase {
    private repository: BudgetRepository;
    private crypto: Crypto;

    constructor(repo: BudgetRepository, crypto: Crypto) {
        this.repository = repo;
        this.crypto = crypto;
    }

    execute(request: CreationBudgetCategoryUseCaseRequest): string {
        try {
            
            if (request.title.replace(' ', '').length == 0) {
                throw new ValidationError('Title field is empty');
            }

            if (request.categories.length <= 0) {
                throw new ValidationError('Budget categories must have at least 1 value');
            }

            if (request.target <= 0) {
                throw new ValidationError('Target price must be greather than 0');
            }

            if (request.period_time <= 0) {
                throw new ValidationError('Period time must be greather than 0');
            }

            let new_id = this.crypto.generate_uuid_to_string()

            let response = this.repository.save_category({
                id: new_id,
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

export class CreationBudgetTagUseCase implements ICreationBudgetUseCase {
    private repository: BudgetRepository;
    private crypto: Crypto;

    constructor(repo: BudgetRepository, crypto: Crypto) {
        this.repository = repo;
        this.crypto = crypto;
    }

    execute(request:CreationBudgetTagUseCaseRequest): string {
        try {
            if (request.title.replace(' ', '').length == 0) {
                throw new ValidationError('Title field is empty');
            }

            if (request.target <= 0) {
                throw new ValidationError('Target price must be greather than 0');
            }


            if (request.tags.length <= 0) {
                throw new ValidationError('Tags must have at least 1 value');
            }

            if (request.date_start >= request.date_end) {
                throw new ValidationError('Date start must be inferiour at Date of end');
            }

            let new_id = this.crypto.generate_uuid_to_string()

            let response = this.repository.save_tag({
                id: new_id,
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