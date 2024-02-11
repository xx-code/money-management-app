import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "../../entities/budget";
import { NotFoundError } from "../../errors/notFoundError";
import { BudgetCategoryRepository, BudgetTagRepository } from "../repositories/budgetRepository";

export interface IGetBudgetUseCase {
    execute(id: string,): BudgetWithCategoryDisplay|BudgetWithTagDisplay
}

export class GetBudgetCategoryUseCase implements IGetBudgetUseCase {
    private repository: BudgetCategoryRepository;
    constructor(repo: BudgetCategoryRepository) {
        this.repository = repo;
    }

    execute(id: string): BudgetWithCategoryDisplay {
        try {
            let response = this.repository.get(id);

            if (response == null) {
                throw new NotFoundError('Budget not found');
            }

            return response;
        } catch(err) {
            throw err;
        }
    }
}

export class GetBudgetTagUseCase implements IGetBudgetUseCase {
    private repository: BudgetTagRepository;
    constructor(repo: BudgetTagRepository) {
        this.repository = repo;
    }

    execute(id: string): BudgetWithTagDisplay {
        try {
            let response = this.repository.get(id);

            if (response == null) {
                throw new NotFoundError('Budget not found');
            }

            return response;
        } catch(err) {
            throw err;
        }
    }
}