import DateParser from "@/core/entities/date_parser";
import { Period } from '../../entities/budget';
import { FutureTransactionRepository, dbFutureTransaction } from "../../repositories/futureTransactionRepository";
import { determined_end_date_with } from "@/core/entities/future_transaction";
import { TransactionRepository } from "../../repositories/transactionRepository";

export interface IAutoUpdateFutureTransactionUseCase {
    execute(): void
}

export interface IAutoUpdateFutureTransactionPresenter {
    success(message: string): void;
    fail(err: Error): void;
}

export class AutoUpdateFutureTransactionUseCase implements IAutoUpdateFutureTransactionUseCase {
    private presenter: IAutoUpdateFutureTransactionPresenter
    private future_transaction_repo: FutureTransactionRepository
    private transaction_repo: TransactionRepository

    constructor(presenter: IAutoUpdateFutureTransactionPresenter, future_transaction_repo: FutureTransactionRepository, transaction_repo: TransactionRepository) {
        this.presenter = presenter
        this.future_transaction_repo = future_transaction_repo
        this.transaction_repo = transaction_repo
    }

    async execute(): Promise<void> {
        try {
            let future_transactions = await this.future_transaction_repo.get_all()

            console.log(future_transactions)

            future_transactions.forEach(async future_transaction => {
                console.log(future_transaction)
                console.log(future_transaction.date_update.compare(DateParser.now()))

                if (future_transaction.date_update.compare(DateParser.now()) < 0) {
                    let new_date_update: DateParser = future_transaction.date_update
                    if (future_transaction.date_end !== null) {
                        if (future_transaction.date_end.compare(DateParser.now()) > 0) {
                            future_transaction.is_archived = true
                        } else {
                            // Save transaction_repo
                            if (future_transaction.date_update.compare(DateParser.now()) > 0) {
                                new_date_update = determined_end_date_with(future_transaction.date_update.toDate(), future_transaction.period, future_transaction.period_time)
                            }
                        }
                    } 

                    while(new_date_update.compare(DateParser.now()) < 0) {
                        new_date_update = determined_end_date_with(new_date_update.toDate(), future_transaction.period, future_transaction.period_time)
                    }

                    let update_future_transaction: dbFutureTransaction = {
                        id: future_transaction.id,
                        account_ref: future_transaction.account.id,
                        is_archived: future_transaction.is_archived,
                        category_ref: future_transaction.category.id,
                        tag_ref: future_transaction.tags,
                        record_ref: future_transaction.record.id,
                        period: future_transaction.period,
                        period_time: future_transaction.period_time,
                        repeat: future_transaction.repeat,
                        date_start: future_transaction.date_start,
                        date_update: new_date_update,
                        date_end: future_transaction.date_end
                    }

                    await this.future_transaction_repo.update(update_future_transaction)
                }
            })

            this.presenter.success('success')
        } catch(err: any) {
            this.presenter.fail(err)
        }
    }
}