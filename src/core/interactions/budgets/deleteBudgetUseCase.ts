import { NotFoundError } from "../../errors/notFoundError";
import { BudgetCategoryRepository, BudgetTagRepository } from "../repositories/budgetRepository";

export interface IDeleteBudgetUseCase {
    execute(id: string): void;
};

export interface IDeleteBudgetUseCaseResponse {
    success(id_deleted: string): void;
    fail(err: Error): void;
}

export class DeleteBudgetCategoryUseCase implements IDeleteBudgetUseCase {
    private repository: BudgetCategoryRepository;
    private presenter: IDeleteBudgetUseCaseResponse;

    constructor(budget_repo: BudgetCategoryRepository, presenter: IDeleteBudgetUseCaseResponse) {
        this.repository = budget_repo;
        this.presenter = presenter;
    }

    async execute(id: string): Promise<void> {
        try {

            let budget = await this.repository.get(id);

            if (budget == null) {
                throw new NotFoundError('Budget not found');
            }

            let response = this.repository.delete(id);

            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
};

export class DeleteBudgetTagUseCase implements IDeleteBudgetUseCase {
    private repository: BudgetTagRepository;
    private presenter: IDeleteBudgetUseCaseResponse;

    constructor(budget_repo: BudgetTagRepository, presenter: IDeleteBudgetUseCaseResponse) {
        this.repository = budget_repo;
        this.presenter = presenter;
    }

    execute(id: string): void {
        try {
            let budget = this.repository.get(id);

            if (budget == null) {
                throw new NotFoundError('Budget not found');
            }

            let response = this.repository.delete(id);

            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
};