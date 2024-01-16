import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "../../entities/budget";
import { BudgetRepository } from "../repositories/budgetRepository";

export interface IGetAllBudgetUseCase {
    execute(): Array<BudgetWithCategoryDisplay|BudgetWithTagDisplay>
}

export class GetAllBudgetUseCase implements IGetAllBudgetUseCase {
    private repository: BudgetRepository;
    constructor(repo: BudgetRepository) {
        this.repository = repo;
    }

    execute(): (BudgetWithCategoryDisplay | BudgetWithTagDisplay)[] {
        try {
            let response = this.repository.get_all();

            return response;
        } catch(err) {
            throw err;
        }
    }
}