import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "../../entities/budget";
import { BudgetTagRepository, BudgetCategoryRepository } from "../repositories/budgetRepository";

export interface IGetAllBudgetUseCase {
    execute(): Array<BudgetWithCategoryDisplay|BudgetWithTagDisplay>
}

export class GetAllBudgetCategoryUseCase implements IGetAllBudgetUseCase {
    private repository: BudgetCategoryRepository;
    constructor(repo: BudgetCategoryRepository) {
        this.repository = repo;
    }

    execute(): BudgetWithCategoryDisplay[] {
        try {
            let response = this.repository.get_all();

            return response;
        } catch(err) {
            throw err;
        }
    }
}


export class GetAllBudgetTagUseCase implements IGetAllBudgetUseCase {
    private repository: BudgetTagRepository;
    constructor(repo: BudgetTagRepository) {
        this.repository = repo;
    }

    execute(): BudgetWithTagDisplay[] {
        try {
            let response = this.repository.get_all();

            return response;
        } catch(err) {
            throw err;
        }
    }
}