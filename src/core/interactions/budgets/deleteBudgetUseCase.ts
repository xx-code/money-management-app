import { NotFoundError } from "../../errors/notFoundError";
import { BudgetCategoryRepository, BudgetTagRepository } from "../repositories/budgetRepository";

export interface IDeleteBudgetUseCase {
    execute(id: string): void;
};

export interface IDeleteBudgetUseCaseResponse {
    success(is_deleted: boolean): void;
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

            let is_deleted = await this.repository.delete(id);

            this.presenter.success(is_deleted);
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

    async execute(id: string): Promise<void> {
        try {
            let budget = await this.repository.get(id);

            if (budget == null) {
                throw new NotFoundError('Budget not found');
            }

            let is_deleted = await this.repository.delete(id);

            this.presenter.success(is_deleted);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
};