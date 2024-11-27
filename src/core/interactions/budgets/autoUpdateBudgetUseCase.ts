import { Budget } from "@/core/domains/entities/budget";
import { BudgetRepository } from "../../repositories/budgetRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { DateParser, determinedEndDateWith } from "@/core/domains/helpers";
import { TransactionType } from "@/core/domains/entities/transaction";

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
            let budgets = await this.budget_repo.getAll()

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
                        let balance = await this.transaction_repo.getBalance({
                            categories: budget.categories,
                            accounts: [],
                            tags: [],
                            type: TransactionType.DEBIT,
                            start_date: budget.date_start.toString(),
                            end_date: budget.date_update.toString(),
                            price: null
                        });
                    
                        let new_date_to_start: DateParser = budget.date_update
                        let new_date_to_update: DateParser = determinedEndDateWith(budget.date_update!.toDate(), budget.period!, budget.period_time!)
                        
                        // update data corretly
                        while (new_date_to_update.compare(DateParser.now()) < 0) {
                            new_date_to_start = new_date_to_update
                            new_date_to_update = determinedEndDateWith(new_date_to_update.toDate(), budget.period!, budget.period_time!)
                        }

                        budget.date_start = new_date_to_start
                        budget.date_update = new_date_to_update
    
                        await this.budget_repo.update(budget)
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