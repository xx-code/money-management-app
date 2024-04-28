import { ValidationError } from "@/core/errors/validationError";
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay, compute_current_spend, determined_start_end_date_budget } from "../../entities/budget";
import { BudgetTagRepository, BudgetCategoryRepository } from "../repositories/budgetRepository";
import { TransactionRepository } from "../repositories/transactionRepository";

export interface IGetAllBudgetUseCase {
    execute(): void;
}

export interface IGetAllBudgetUseCaseResponse { 
    success(budgets: Array<BudgetWithCategoryDisplay|BudgetWithTagDisplay>): void;
    fail(err: Error): void;
}

export class GetAllBudgetCategoryUseCase implements IGetAllBudgetUseCase {
    private budget_repository: BudgetCategoryRepository;
    private transaction_repository: TransactionRepository;
    private presenter: IGetAllBudgetUseCaseResponse;
    
    constructor(budget_repository: BudgetCategoryRepository, transaction_repository: TransactionRepository, presenter: IGetAllBudgetUseCaseResponse) {
        this.budget_repository = budget_repository;
        this.transaction_repository = transaction_repository;
        this.presenter = presenter;
    }

    async execute(): Promise<void> {
        try {
            let budgets = await this.budget_repository.get_all();
            
            let budgets_display = [];
            for (let i = 0; i < budgets.length; i++) {
                let budget = budgets[i];
                
                let current_date_budget = determined_start_end_date_budget(budget);

                let start_date = current_date_budget.start_date;
                let end_date = current_date_budget.end_date;

                let transactions = await this.transaction_repository.get_transactions_by_categories(budget.categories.map(cat => cat.title), start_date, end_date);
                
                let budget_display: BudgetWithCategoryDisplay = {
                    id: budget.id,
                    title: budget.title,
                    categories: budget.categories,
                    current: compute_current_spend(transactions),
                    period: budget.period,
                    period_time: budget.period_time,
                    target: budget.target
                };
                budgets_display.push(budget_display);
            }
 
            this.presenter.success(budgets_display)
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}


export class GetAllBudgetTagUseCase implements IGetAllBudgetUseCase {
    private budget_repository: BudgetTagRepository;
    private transaction_repository: TransactionRepository;
    private presenter: IGetAllBudgetUseCaseResponse;

    constructor(budget_repository: BudgetTagRepository, transaction_repository: TransactionRepository, presenter: IGetAllBudgetUseCaseResponse) {
        this.budget_repository = budget_repository;
        this.transaction_repository = transaction_repository;
        this.presenter = presenter;
    }

    async execute(): Promise<void> {
        try {
            let budgets = await this.budget_repository.get_all();

            let budgets_display = [];
            for (let i = 0; i < budgets.length; i++) {
                let budget = budgets[i];

                let transactions = await this.transaction_repository.get_transactions_by_tags(budget.tags, budget.date_start, budget.date_end);

                let budget_display: BudgetWithTagDisplay = {
                    id: budget.id,
                    title: budget.title,
                    current: compute_current_spend(transactions),
                    date_start: budget.date_start,
                    date_end: budget.date_end,
                    target: budget.target,
                    tags: budget.tags
                };
                
                budgets_display.push(budget_display);
            }

            this.presenter.success(budgets_display);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}