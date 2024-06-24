import DateParser from "@/core/entities/date_parser";
import { CategoryRepository } from "../repositories/categoryRepository";
import { RecordRepository } from "../repositories/recordRepository";
import { CurrentDateBudget, Period } from '../../entities/budget';
import { FutureTransactionRepository, dbFutureTransaction } from "../repositories/futureTransactionRepository";
import { Category } from "@/core/entities/category";
import { ValidationError } from "@/core/errors/validationError";
import { TransactionType } from "@/core/entities/transaction";
import { is_empty } from "@/core/entities/verify_empty_value";
import { formatted } from "@/core/entities/formatted";
import { CryptoService } from "@/core/adapter/libs";
import { determined_start_end_date } from "@/core/entities/budget";

export type RequestAddFutureTransaction = {
    category_ref: string;
    tags_ref: string[];
    description: string;
    price: number;
    type_record: TransactionType;
    date_start: DateParser;
    period: string;
    period_time: number;
}

export interface IAddFutureTransactionUseCase {
    execute(request: RequestAddFutureTransaction): void
}

export interface AddFutureTransactionPresenter {
    success(id_new_trans: string): void;
    fail(err: Error): void;
}

export class AddFutureTransactionUseCase implements IAddFutureTransactionUseCase {
    private category_repository: CategoryRepository;
    private record_repository: RecordRepository;
    private future_transaction_repository: FutureTransactionRepository;
    private crypto: CryptoService;
    private presenter: AddFutureTransactionPresenter;

    constructor(category_repository: CategoryRepository, record_repository: RecordRepository, 
        future_transaction_repository: FutureTransactionRepository, crypto: CryptoService, presenter: AddFutureTransactionPresenter) {
            this.category_repository = category_repository;
            this.record_repository = record_repository;
            this.future_transaction_repository = future_transaction_repository;
            this.crypto = crypto;
            this.presenter = presenter;
    }

    async execute(request: RequestAddFutureTransaction): Promise<void> {
        try {
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

            const period_list = ['Month', 'Week' , 'Year']
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
                    date: request.date_start,
                }
            )


            if (!is_record_saved) {
                throw new Error("We can't save the future record");
            }

            let date_start_end: CurrentDateBudget = determined_start_end_date(
                new Date(request.date_start.getYear(), request.date_start.getMonth(), request.date_start.getDay()),
                <Period>request.period, request.period_time)

            let date_end = date_start_end.end_date;   

            let id_new_future_transaction = this.crypto.generate_uuid_to_string()
            let futur_transaction: dbFutureTransaction = {
                id: id_new_future_transaction,
                category_ref: category!.id,
                tag_ref: tags,
                record_ref: new_id_record,
                period: request.period,
                period_time: request.period_time,
                date_end: date_end
            }

            await this.future_transaction_repository.save(futur_transaction);
            this.presenter.success(id_new_future_transaction);
        } catch(err: any) {
            this.presenter.fail(err)
        } 
    }
}