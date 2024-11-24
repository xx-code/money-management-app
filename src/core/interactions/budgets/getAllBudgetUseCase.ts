import { BudgetRepository } from "../../repositories/budgetRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { TransactionType } from "../../../core/entities/transaction";
import { formatted, reverseFormatted } from "@/core/entities/formatted";
import { determined_start_end_date_budget } from "@/core/entities/budget";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { Category } from "@/core/entities/category";

export type BudgetCategoryOutput = {
    id: string
    title: string
    icon: string
}

export type BudgetOutput = {
    id: string,
    title: string,
    target: number,
    categories: BudgetCategoryOutput[],
    tags: string[]
    period: string|null
    period_time: number
    currentBalance: number
    start_date: string
    update_date: string
    end_date: string|null
}

export interface IGetAllBudgetUseCase {
    execute(): void;
}

export interface IGetAllBudgetUseCaseResponse { 
    success(budgets: Array<BudgetOutput>): void;
    fail(err: Error): void;
}

export class GetAllBudgetUseCase implements IGetAllBudgetUseCase {
    private budget_repository: BudgetRepository;
    private transaction_repository: TransactionRepository;
    private category_repository: CategoryRepository
    private presenter: IGetAllBudgetUseCaseResponse;
    
    constructor(budget_repository: BudgetRepository, category_repository: CategoryRepository, transaction_repository: TransactionRepository, presenter: IGetAllBudgetUseCaseResponse) {
        this.budget_repository = budget_repository;
        this.transaction_repository = transaction_repository;
        this.category_repository = category_repository
        this.presenter = presenter;
    }

    async execute(): Promise<void> {
        try {
            let budgets = await this.budget_repository.get_all();
            
            let budgets_display = [];
            for (let i = 0; i < budgets.length; i++) {
                let budget = budgets[i];
                
                let start_date = budget.date_start
                let end_date = budget.date_update

                if (budget.period)  {
                    let current_date_budget = determined_start_end_date_budget(budget.period!, budget.period_time!)
                    start_date = current_date_budget.start_date
                    end_date = current_date_budget.end_date
                    if (budget.date_end && end_date.compare(budget.date_end) < 0)
                        end_date = budget.date_end
                }

                let categories: BudgetCategoryOutput[] =  [] 
                for(let category_id of budget.categories) {
                    let category = await this.category_repository.get(category_id)
                    if (category !== null)
                        categories.push({id: category.id, title: category.title, icon: category.icon})
                }
            
                let balance = await this.transaction_repository.get_balance({
                    categories: budget.categories,
                    accounts: [],
                    tags: budget.tags.map(tag => formatted(tag)),
                    type: TransactionType.Debit,
                    start_date: start_date,
                    end_date: end_date,
                    price: null
                });
                
                let budget_display: BudgetOutput = {
                    id: budget.id,
                    title: budget.title,
                    categories: categories,
                    currentBalance: Math.abs(balance),
                    period: budget.period,
                    period_time: budget.period_time,
                    target: budget.target,
                    start_date: budget.date_start.toString(),
                    update_date: budget.date_update.toString(),
                    end_date: budget.date_end ? budget.date_end.toString() : null,
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