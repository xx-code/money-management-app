import DateParser from "@/core/entities/date_parser";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { RecordRepository } from "../../repositories/recordRepository";
import { CurrentDateBudget, Period } from '../../entities/budget';
import { FutureTransactionRepository, dbFutureTransaction } from "../../repositories/futureTransactionRepository";
import { Category } from "@/core/entities/category";
import { ValidationError } from "@/core/errors/validationError";
import { TransactionType } from "@/core/entities/transaction";
import { is_empty } from "@/core/entities/verify_empty_value";
import { formatted } from "@/core/entities/formatted";
import { CryptoService } from "@/core/adapters/libs";
import { determined_end_date_with } from "@/core/entities/future_transaction";
import { AccountRepository } from "../../repositories/accountRepository";
import { Account } from "@/core/entities/account";

export type RequestAddFutureTransaction = {
    account_ref: string;
    category_ref: string;
    tags_ref: string[];
    description: string;
    price: number;
    type_record: TransactionType;
    date_start: string;
    period: string;
    period_time: number;
    repeat: number | null;
}

export interface IAddFutureTransactionUseCase {
    execute(request: RequestAddFutureTransaction): void
}

export interface IAddFutureTransactionPresenter {
    success(id_new_trans: string): void;
    fail(err: Error): void;
}

export class AddFutureTransactionUseCase implements IAddFutureTransactionUseCase {
    private category_repository: CategoryRepository;
    private record_repository: RecordRepository;
    private future_transaction_repository: FutureTransactionRepository;
    private account_repository: AccountRepository;
    private crypto: CryptoService;
    private presenter: IAddFutureTransactionPresenter;

    constructor(category_repository: CategoryRepository, record_repository: RecordRepository, account_repository: AccountRepository,
        future_transaction_repository: FutureTransactionRepository, crypto: CryptoService, presenter: IAddFutureTransactionPresenter) {
            this.category_repository = category_repository;
            this.record_repository = record_repository;
            this.account_repository = account_repository;
            this.future_transaction_repository = future_transaction_repository;
            this.crypto = crypto;
            this.presenter = presenter;
    }

    async execute(request: RequestAddFutureTransaction): Promise<void> {
        try {

            let account: Account|null = await this.account_repository.get(request.account_ref);

            if (account === null) {
                throw new ValidationError(`this account don\'t exist`)
            }

            let category: Category|null = await this.category_repository.get(request.category_ref);

            if (category === null) {
                this.presenter.fail(new ValidationError("Category not exist"));
            }

            let tags = []
            if (request.tags_ref.length > 0) {
                for(let i = 0; i < request.tags_ref.length; i++) {
                    if (is_empty(request.tags_ref[i])) {
                        throw new ValidationError('Tag ' + request.tags_ref[i] + 'ref field is empty');
                    }
                    tags.push(formatted(request.tags_ref[i]));
                } 
            }

            if (request.price <= 0) {
                throw new ValidationError('The price must be greater than 0');
            }

            if (is_empty(request.description))  {
                throw new ValidationError('Description field is empty');
            }

            if (is_empty(request.period)) {
                throw new ValidationError('Period field is empty');
            }

            if (request.period_time <= 0) {
                throw new ValidationError('Period time must be greater than 0');
            }

            if (is_empty(request.date_start)) {
                throw new ValidationError('Date start is empty')
            }
            let date_start: DateParser = DateParser.from_string(request.date_start)

            let date_end: DateParser | null = null; 
            if (request.repeat !== null && request.repeat !== undefined ) {
                if (request.repeat <= 0) {
                    throw new ValidationError('Repeat number must be greater than 0');
                }
                date_end = determined_end_date_with(date_start.toDate(), <Period>request.period, request.period_time, request.repeat);  
            }

            const period_list = ['Month', 'Week' , 'Year', 'Day']
            if (!period_list.includes(request.period)) {
                throw new ValidationError('Period must be Week, Month or year');
            }

            let new_id_record = this.crypto.generate_uuid_to_string()

            let is_record_saved = await this.record_repository.save(
                {
                    id: new_id_record,
                    price: request.price,
                    description: request.description,
                    type: request.type_record,
                    date: date_start,
                }
            )


            if (!is_record_saved) {
                throw new Error("We can't save the future record");
            }

            
            let date_update = determined_end_date_with(date_start.toDate(), <Period>request.period, request.period_time);
            
             
            let id_new_future_transaction = this.crypto.generate_uuid_to_string()
            let futur_transaction: dbFutureTransaction = {
                id: id_new_future_transaction,
                account_ref: request.account_ref,
                is_archived: false,
                category_ref: category!.id,
                tag_ref: tags,
                record_ref: new_id_record,
                period: request.period,
                period_time: request.period_time,
                repeat: request.repeat,
                date_start: date_start,
                date_update: date_update,
                date_end: date_end,
            }

            let id_transaction_saved = await this.future_transaction_repository.save(futur_transaction);
            this.presenter.success(id_transaction_saved);
        } catch(err) {
            this.presenter.fail(err as Error)
        } 
    }
}