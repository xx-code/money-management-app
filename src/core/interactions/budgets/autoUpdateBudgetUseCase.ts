import DateParser from "@/core/entities/date_parser";
import { determined_end_date_with } from "@/core/entities/future_transaction";
import { BudgetRepository } from "../../repositories/budgetRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { TransactionType } from "@/core/entities/transaction";
import { Budget } from "@/core/entities/budget";

export interface IAutoUpdateBudgetUseCase {
    execute(): void
}

export interface IAutoUpdateBudgetPresenter {
    success(message: string): void;
    fail(err: Error): void;
}

export class AutoUpdateBudgetUseCase implements IAutoUpdateBudgetUseCase {
    private presenter: IAutoUpdateBudgetPresenter
    private budget_repo: BudgetRepository
    private transaction_repo: TransactionRepository

    constructor(presenter: IAutoUpdateBudgetPresenter, budget_repo: BudgetRepository, transaction_repo: TransactionRepository) {
        this.presenter = presenter
        this.budget_repo = budget_repo
        this.transaction_repo = transaction_repo
    }

    async execute(): Promise<void> {
        try {
            let budgets = await this.budget_repo.get_all()

            budgets.forEach(async budget => {
                this.updateBudget(budget)
            })

            this.presenter.success('success')
        } catch(err: any) {
            this.presenter.fail(err)
        }
    }

    async updateBudget(budget: Budget): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {

                if (budget.date_end !== null && budget.date_end.compare(DateParser.now()) <= 0) {
                    budget.is_archived = true
                    await this.budget_repo.update(budget)
                } else {
                    if (budget.date_update.compare(DateParser.now()) <= 0) {
                        let balance = await this.transaction_repo.get_balance({
                            categories: budget.categories,
                            accounts: [],
                            tags: [],
                            type: TransactionType.Debit,
                            start_date: budget.date_start,
                            end_date: budget.date_update,
                            price: null
                        });
                    
                        let new_date_to_start: DateParser = budget.date_update
                        let new_date_to_update: DateParser = determined_end_date_with(budget.date_update!.toDate(), budget.period!, budget.period_time!)
                        
                        // update data corretly
                        while (new_date_to_update.compare(DateParser.now()) < 0) {
                            new_date_to_start = new_date_to_update
                            new_date_to_update = determined_end_date_with(new_date_to_update.toDate(), budget.period!, budget.period_time!)
                        }
    
                        await this.budget_repo.update({
                            id: budget.id,
                            title: budget.title,
                            target: budget.target + (budget.target - Math.abs(balance)),
                            period: budget.period,
                            is_archived: false,
                            date_start: new_date_to_start,
                            date_update: new_date_to_update,
                            categories: budget.categories,
                            period_time: budget.period_time,
                            date_end: budget.date_end,
                            tags: budget.tags
                        })
                    }
                }
                
                resolve(true)
            } catch(err: any) {
                console.log(err)
                resolve(false)
            }
        })
        
    }
}