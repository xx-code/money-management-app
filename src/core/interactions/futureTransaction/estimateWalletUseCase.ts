import DateParser from "@/core/entities/date_parser";
import { TransactionType } from "@/core/entities/transaction";
import { FutureTransactionRepository } from "../../repositories/futureTransactionRepository";
import { diff_between_date_by } from "@/core/entities/libs";
import { TransactionRepository, dbFilter } from "../../repositories/transactionRepository";

export type RecordForEstimation = {
    price: number,
    date: string,
    type: TransactionType
}

export type RequestEstimation = {
    records: RecordForEstimation[];
    // categories_to_estimate: string[];
    // tags_to_estimate: string[];
}

export interface IEstimateWalletUseCase {
    execute(request: RequestEstimation): void
}

export interface IEstimateWalletPresenter {
    success(estimation: number): void
    fail(err: Error): void 
}


export class EstimateWalletUseCase implements IEstimateWalletUseCase {
    private presenter: IEstimateWalletPresenter;
    private future_transaction_repository: FutureTransactionRepository;
    private transaction_repository: TransactionRepository;

    constructor(presenter: IEstimateWalletPresenter, future_transaction_repo: FutureTransactionRepository, transaction_repo: TransactionRepository) {
        this.presenter = presenter;
        this.future_transaction_repository = future_transaction_repo;
        this.transaction_repository = transaction_repo;
    }

    async execute(request: RequestEstimation): Promise<void> {
        try {
            let dates_estimation: DateParser[] = request.records.map(record => DateParser.from_string(record.date))
            dates_estimation = dates_estimation.sort((date1, date2) => date1.compare(date2))

            if (dates_estimation[0].compare(DateParser.now()) < 0) {
                throw new Error("We can't start stimulation before the date now");
            }

            let date_end_estimation = dates_estimation.reverse()[0]

            let future_transactions = await this.future_transaction_repository.get_all();

            future_transactions = future_transactions.filter((val, index) => val.date_end === null ? true : val.date_end.compare(DateParser.now()) >= 0 )

            let credit: number = 0;
            let debit: number = 0;

            for (let i = 0; i < request.records.length; i++) {
                let record = request.records[i];
                if (record.type === TransactionType.Credit) {
                    credit += record.price;
                } else {
                    debit += record.price;
                }
            }


            // future_transactions.filter((val, index) => val.period === 'Day')
            
            let today = new Date();
            future_transactions.forEach(future_transaction => {
                let date_end = future_transaction.date_end !== null ? future_transaction.date_end.toDate() : date_end_estimation.toDate()
                
                let diff = 0;

                if (future_transaction.period === 'Year') {    
                    diff = diff_between_date_by(today, date_end, 'Year')
                    diff = diff === 0 ? diff + 1 : diff
                }
                
                if (future_transaction.period === 'Month') {
                    diff = diff_between_date_by(today, date_end, 'Month')
                    diff = diff === 0 ? diff + 1 : diff
                }

                if (future_transaction.period === 'Week') {
                    diff = diff_between_date_by(today, date_end, 'Week')
                    diff = diff === 0 ? diff + 1 : diff
                }

                if (future_transaction.period === 'Day') {
                    diff = diff_between_date_by(today, date_end, 'Day')
                }

                let num_count = Math.ceil(diff/future_transaction.period_time);
                let estimate_price = num_count*future_transaction.record.price

                if (future_transaction.record.type === TransactionType.Credit) {
                    credit += estimate_price
                } else {
                    debit += estimate_price
                }
            });

            

            let filter: dbFilter = {
                accounts: [],
                categories: [],
                tags: [],
                start_date: null,
                end_date: null,
                type: null,
                price: null
            }

            let balances = await this.transaction_repository.get_balance(filter)

            console.log(debit + ' + ' + credit)
            console.log(balances)

            let estimation = debit - credit;

            let estimate_balance = balances - estimation

            this.presenter.success(estimate_balance);

        } catch (err) {
            this.presenter.fail(err as Error)
        }
    }
} 