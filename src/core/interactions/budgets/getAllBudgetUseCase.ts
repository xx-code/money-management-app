import { BudgetDisplay } from "../../entities/budget";
import { BudgetRepository } from "../repositories/budgetRepository";
import { TransactionRepository } from "../repositories/transactionRepository";
import { TransactionType } from "../../../core/entities/transaction";
import { reverseFormatted } from "@/core/entities/formatted";

export interface IGetAllBudgetUseCase {
    execute(): void;
}

export interface IGetAllBudgetUseCaseResponse { 
    success(budgets: Array<BudgetDisplay>): void;
    fail(err: Error): void;
}

export class GetAllBudgetCategoryUseCase implements IGetAllBudgetUseCase {
    private budget_repository: BudgetRepository;
    private transaction_repository: TransactionRepository;
    private presenter: IGetAllBudgetUseCaseResponse;
    
    constructor(budget_repository: BudgetRepository, transaction_repository: TransactionRepository, presenter: IGetAllBudgetUseCaseResponse) {
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
                
                let budget_display: BudgetDisplay = {
                    id: budget.id,
                    title: budget.title,
                    categories: budget.categories.map(cat => ({id: cat.id, title: reverseFormatted(cat.title), icon: cat.icon })),
                    current: Math.abs(balance),
                    period: budget.period,
                    period_time: budget.period_time,
                    target: budget.target,
                    date_start: budget.date_start,
                    date_to_update: budget.date_to_update,
                    is_periodic: budget.is_periodic,
                    date_end: budget.date_end,
                    tags: budget.tags.map((tag => reverseFormatted(tag)))
                };
                budgets_display.push(budget_display);
            }
 
            this.presenter.success(budgets_display)
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}