import { NotFoundError } from "../../errors/notFoundError";
import { BudgetCategoryRepository, BudgetTagRepository } from "../repositories/budgetRepository";

export interface IDeleteBudgetUseCase {
    execute(id: string): boolean;
};

export class DeleteBudgetCategoryUseCase implements IDeleteBudgetUseCase {
    private repository: BudgetCategoryRepository;

    constructor(repo: BudgetCategoryRepository) {
        this.repository = repo;
    }

    execute(id: string): boolean {
        try {
            let response = this.repository.delete(id);

            if (response == null) {
                throw new NotFoundError('Budget not found');
            }

            return response;
        } catch(err) {
            throw err;
        }
    }
};

export class DeleteBudgetTagUseCase implements IDeleteBudgetUseCase {
    private repository: BudgetTagRepository;

    constructor(repo: BudgetTagRepository) {
        this.repository = repo;
    }

    execute(id: string): boolean {
        try {
            let response = this.repository.delete(id);

            if (response == null) {
                throw new NotFoundError('Budget not found');
            }

            return response;
        } catch(err) {
            throw err;
        }
    }
};