import DateParser from "@/core/entities/date_parser";
import { BudgetWithCategory, Period } from '../../entities/budget';
import { determined_end_date_with } from "@/core/entities/future_transaction";
import { BudgetCategoryRepository } from "../repositories/budgetRepository";
import { CryptoService } from "@/core/adapter/libs";
import { TransactionRepository } from "../repositories/transactionRepository";
import { TransactionType } from "@/core/entities/transaction";

export interface IAutoUpdateBudgetUseCase {
    execute(): void
}

export interface IAutoUpdateBudgetPresenter {
    success(message: string): void;
    fail(err: Error): void;
}

export class AutoUpdateBudgetUseCase implements IAutoUpdateBudgetUseCase {
    private presenter: IAutoUpdateBudgetPresenter
    private budget_repo: BudgetCategoryRepository
    private transaction_repo: TransactionRepository
    private crypto: CryptoService;

    constructor(presenter: IAutoUpdateBudgetPresenter, budget_repo: BudgetCategoryRepository, transaction_repo: TransactionRepository, crypto: CryptoService) {
        this.presenter = presenter
        this.budget_repo = budget_repo
        this.transaction_repo = transaction_repo
        this.crypto = crypto;
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

    async updateBudget(budget: BudgetWithCategory): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                
                if (budget.date_to_update.compare(DateParser.now()) < 0) {
                    let balance = await this.transaction_repo.get_balance({
                        categories: budget.categories.map(cat => cat.id),
                        tags: [],
                        accounts: [],
                        type: TransactionType.Debit,
                        start_date: budget.date_start,
                        end_date: budget.date_to_update,
                        price: null
                    });

                    await this.budget_repo.archived(budget.id, balance)
                
                    let new_date_to_start: DateParser = budget.date_to_update
                    let new_date_to_update: DateParser = determined_end_date_with(budget.date_to_update.toDate(), budget.period, budget.period_time)

                    while (new_date_to_update.compare(DateParser.now()) < 0) {
                        new_date_to_start = new_date_to_update
                        new_date_to_update = determined_end_date_with(new_date_to_update.toDate(), budget.period, budget.period_time)
                    }

                    let new_id = this.crypto.generate_uuid_to_string()

                    await this.budget_repo.save({
                        id: new_id,
                        title: budget.title,
                        target: budget.target,
                        period: budget.period,
                        is_archived: false,
                        date_start: new_date_to_start,
                        date_to_update: new_date_to_update,
                        categories: budget.categories.map(category => category.id),
                        period_time: budget.period_time,
                    })
                }
                
                resolve(true)
            } catch(err: any) {
                console.log(err)
                resolve(false)
            }
        })
        
    }
}