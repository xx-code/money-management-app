import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "../../entities/budget";
import { NotFoundError } from "../errors/notFoundError";
import { BudgetRepository } from "../repositories/budgetRepository";

export interface IGetBudgetUseCase {
    execute(id: string,): BudgetWithCategoryDisplay|BudgetWithTagDisplay
}

export class GetBudgetUseCase implements IGetBudgetUseCase {
    private repository: BudgetRepository;
    constructor(repo: BudgetRepository) {
        this.repository = repo;
    }

    execute(id: string): BudgetWithCategoryDisplay | BudgetWithTagDisplay {
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