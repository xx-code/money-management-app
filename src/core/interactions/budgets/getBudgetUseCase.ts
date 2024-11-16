import { reverseFormatted } from "@/core/entities/formatted";
import { BudgetDisplay, determined_start_end_date_budget } from "../../entities/budget";
import { NotFoundError } from "../../errors/notFoundError";
import { BudgetRepository } from "../repositories/budgetRepository";
import { TransactionRepository } from "../repositories/transactionRepository";

export interface IGetBudgetUseCase {
    execute(id: string,): void;
}

export interface IGetBudgetUseCaseResponse {
    success(budget: BudgetDisplay): void;
    fail(err: Error): void;
}

export class GetBudgetCategoryUseCase implements IGetBudgetUseCase {
    private budget_repository: BudgetRepository;
    private transaction_repository: TransactionRepository;
    private presenter: IGetBudgetUseCaseResponse;

    constructor(budget_repository: BudgetRepository, transaction_repository: TransactionRepository, presenter: IGetBudgetUseCaseResponse) {
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

        
            let start_date = budget.date_start;
            let end_date = budget.date_end;
            if (budget.is_periodic)  {
                let current_date_budget = determined_start_end_date_budget(budget.period!, budget.period_time!)
                start_date = current_date_budget.start_date
                end_date = current_date_budget.end_date
            }
                

            let balance = await this.transaction_repository.get_balance({
                categories: budget.categories.map(cat => cat.id),
                accounts: [],
                tags: [],
                type: null,
                start_date: start_date,
                end_date: end_date,
                price: null
            });
            
            let budget_display: BudgetDisplay = {
                id: budget.id,
                title: budget.title,
                categories: budget.categories.map(cat => ({ id: cat.id, title: reverseFormatted(cat.title), icon: cat.icon })),
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

            this.presenter.success(budget_display);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}