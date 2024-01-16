import { NotFoundError } from "../errors/notFoundError";
import { BudgetRepository } from "../repositories/budgetRepository";

export interface IDeleteBudgetUseCase {
    execute(id: string): boolean;
};

export class DeleteBudgetUseCase implements IDeleteBudgetUseCase {
    private repository: BudgetRepository;

    constructor(repo: BudgetRepository) {
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