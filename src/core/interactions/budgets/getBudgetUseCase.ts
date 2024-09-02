import { ValidationError } from "@/core/errors/validationError";
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay, compute_current_spend, determined_start_end_date_budget } from "../../entities/budget";
import { NotFoundError } from "../../errors/notFoundError";
import { BudgetCategoryRepository, BudgetTagRepository } from "../repositories/budgetRepository";
import { TransactionRepository } from "../repositories/transactionRepository";

export interface IGetBudgetUseCase {
    execute(id: string,): void;
}

export interface IGetBudgetUseCaseResponse {
    success(budget: BudgetWithCategoryDisplay| BudgetWithTagDisplay): void;
    fail(err: Error): void;
}

export class GetBudgetCategoryUseCase implements IGetBudgetUseCase {
    private budget_repository: BudgetCategoryRepository;
    private transaction_repository: TransactionRepository;
    private presenter: IGetBudgetUseCaseResponse;

    constructor(budget_repository: BudgetCategoryRepository, transaction_repository: TransactionRepository, presenter: IGetBudgetUseCaseResponse) {
        this.budget_repository = budget_repository;
        this.presenter = presenter;
        this.transaction_repository = transaction_repository;
    }

    async execute(id: string): Promise<void> {
        try {
            let budget = await this.budget_repository.get(id);

            if (budget == null) {
                throw new NotFoundError('Budget not found');
            }

            let current_date_budget = determined_start_end_date_budget(budget)

            let start_date = current_date_budget.start_date;
            let end_date = current_date_budget.end_date;

            let balance = await this.transaction_repository.get_balance({
                categories: budget.categories.map(cat => cat.id),
                accounts: [],
                tags: [],
                type: null,
                start_date: start_date,
                end_date: end_date,
                price: null
            });
            
            let budget_display: BudgetWithCategoryDisplay = {
                id: budget.id,
                date_start: budget.date_start,
                date_to_update: budget.date_to_update,
                title: budget.title,
                categories: budget.categories,
                current: balance,
                period: budget.period,
                period_time: budget.period_time,
                target: budget.target
            };

            this.presenter.success(budget_display);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}

export class GetBudgetTagUseCase implements IGetBudgetUseCase {
    private budget_repository: BudgetTagRepository;
    private transaction_repository: TransactionRepository;
    private presenter: IGetBudgetUseCaseResponse;

    constructor(budget_repository: BudgetTagRepository, transaction_repository: TransactionRepository, presenter: IGetBudgetUseCaseResponse) {
        this.budget_repository = budget_repository;
        this.transaction_repository = transaction_repository;
        this.presenter = presenter;
    }

    async execute(id: string): Promise<void> {
        try {
            let budget = await this.budget_repository.get(id);

            if (budget == null) {
                throw new NotFoundError('Budget not found');
            }

            let balance = await this.transaction_repository.get_balance({
                categories: [],
                accounts: [],
                tags: budget.tags,
                type: null,
                start_date: budget.date_start,
                end_date: budget.date_end,
                price: null
            });

            let budget_display: BudgetWithTagDisplay = {
                id: budget.id,
                title: budget.title,
                current: balance,
                date_start: budget.date_start,
                date_end: budget.date_end,
                target: budget.target,
                tags: budget.tags
            };

            this.presenter.success(budget_display);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}