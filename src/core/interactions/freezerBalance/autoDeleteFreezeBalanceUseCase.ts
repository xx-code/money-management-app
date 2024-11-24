import { RecordRepository } from "@/core/repositories/recordRepository";
import { TransactionFilter, SortBy, TransactionRepository } from "../../repositories/transactionRepository";
import ValidationError from "@/core/errors/validationError";
import { FREEZE_CATEGORY_ID } from "@/core/domains/constants";
import { DateParser } from "@/core/domains/helpers";

export interface IAutoDeleteFreezeBalanceUseCase {
    execute(): void
}

export interface IAutoDeleteFreezeBalancePresenter {
    success(message: string): void;
    fail(err: Error): void;
}

export class AutoDeleteFreezeBalanceUseCase  implements IAutoDeleteFreezeBalanceUseCase {
    private transaction_repository: TransactionRepository;
    private record_repository: RecordRepository
    private presenter: IAutoDeleteFreezeBalancePresenter;

    constructor(transaction_repo: TransactionRepository, record_repository: RecordRepository, presenter: IAutoDeleteFreezeBalancePresenter) {
        this.transaction_repository = transaction_repo;
        this.record_repository = record_repository;
        this.presenter = presenter;
    }

    async execute(): Promise<void> {
        try {

            let categories_to_filter = [FREEZE_CATEGORY_ID]

        
            let filters: TransactionFilter = {
                accounts: [], 
                tags: [],
                categories: categories_to_filter,
                start_date: null,
                end_date: null,
                type: null,
                price: null
            };

            let sort_by: SortBy|null = null;
      
            let response = await this.transaction_repository.getPaginations(-1, 1, sort_by, filters);

            for (let i = 0; i < response.transactions.length ; i++) {
                let record = await this.record_repository.get(response.transactions[i].record_ref)

                if (record === null)
                    throw new ValidationError('Auto delete freeze error in reading record')

                if (DateParser.now().compare(record.date) >= 0) {
                    await this.record_repository.delete(record.id)
                    await this.transaction_repository.delete(response.transactions[i].id)
                }
            }

            this.presenter.success("done");
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}