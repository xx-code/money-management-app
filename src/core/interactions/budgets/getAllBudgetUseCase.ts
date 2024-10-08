import { ValidationError } from "@/core/errors/validationError";
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay, compute_current_spend, determined_start_end_date_budget } from "../../entities/budget";
import { BudgetTagRepository, BudgetCategoryRepository } from "../repositories/budgetRepository";
import { TransactionRepository } from "../repositories/transactionRepository";
import { TransactionType } from "../../../core/entities/transaction";
import { determined_end_date_with } from "@/core/entities/future_transaction";

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
                
                let start_date = budget.date_start
                let update_date = budget.date_to_update

                let balance = await this.transaction_repository.get_balance({
                    categories: budget.categories.map(cat => cat.id),
                    accounts: [],
                    tags: [],
                    type: TransactionType.Debit,
                    start_date: start_date,
                    end_date: update_date,
                    price: null
                });
                
                let budget_display: BudgetWithCategoryDisplay = {
                    id: budget.id,
                    title: budget.title,
                    categories: budget.categories,
                    current: Math.abs(balance),
                    period: budget.period,
                    period_time: budget.period_time,
                    target: budget.target,
                    date_start: budget.date_start,
                    date_to_update: budget.date_to_update
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

                let balance = await this.transaction_repository.get_balance({
                    categories: [],
                    accounts: [],
                    tags: budget.tags,
                    type: TransactionType.Debit,
                    start_date: budget.date_start,
                    end_date: budget.date_end,
                    price: null
                });

                let budget_display: BudgetWithTagDisplay = {
                    id: budget.id,
                    title: budget.title,
                    current: Math.abs(balance),
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