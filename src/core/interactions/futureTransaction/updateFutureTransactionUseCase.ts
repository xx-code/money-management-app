import DateParser from "@/core/entities/date_parser";
import { CategoryRepository } from "../repositories/categoryRepository";
import { RecordRepository } from "../repositories/recordRepository";
import { FutureTransactionRepository, dbFutureTransaction } from "../repositories/futureTransactionRepository";
import { Category } from "@/core/entities/category";
import { ValidationError } from "@/core/errors/validationError";
import { TransactionType } from "@/core/entities/transaction";
import { is_empty } from "@/core/entities/verify_empty_value";
import { formatted } from "@/core/entities/formatted";
import { CryptoService } from "@/core/adapter/libs";
import { FutureTransaction } from "@/core/entities/future_transaction";

export type RequestUpdateFutureTransaction = {
    id: string;
    category_ref: string | null | undefined;
    tags_ref: string[] | null | undefined;
    description: string | null | undefined;
    price: number | null | undefined;
    type_record: TransactionType | null | undefined;
    date_start: DateParser | null | undefined;
    period: string | null | undefined;
    period_time: number | null | undefined;
    date_end: DateParser | null;
}

export interface IUpdateFutureTransactionUseCase {
    execute(request: RequestUpdateFutureTransaction): void
}

export interface UpdateFutureTransactionPresenter {
    success(is_update: boolean): void;
    fail(err: Error): void;
}

export class AddFutureTransactionUseCase implements IUpdateFutureTransactionUseCase {
    private category_repository: CategoryRepository;
    private record_repository: RecordRepository;
    private future_transaction_repository: FutureTransactionRepository;
    private crypto: CryptoService;
    private presenter: UpdateFutureTransactionPresenter;

    constructor(category_repository: CategoryRepository, record_repository: RecordRepository, 
        future_transaction_repository: FutureTransactionRepository, crypto: CryptoService, presenter: UpdateFutureTransactionPresenter) {
            this.category_repository = category_repository;
            this.record_repository = record_repository;
            this.future_transaction_repository = future_transaction_repository;
            this.crypto = crypto;
            this.presenter = presenter;
    }

    async execute(request: RequestUpdateFutureTransaction): Promise<void> {
        let future_transaction: FutureTransaction | null =  await this.future_transaction_repository.get(request.id)

        if (future_transaction === null) {
            throw new ValidationError('Future transaction d\'ont existe');
        }
        
        if (request.category_ref !== null && request.category_ref !== undefined) {
            let category: Category|null = await this.category_repository.get(request.category_ref);
            if (category === null) {
                throw new ValidationError('Category not found');
            }
        }

        let tags = []
        // Todo: work on tag repository for update
        if (request.tags_ref !== null && request.tags_ref !== undefined) {
            if (request.tags_ref.length > 0) {
                for(let i = 0; i < request.tags_ref.length; i++) {
                    if (is_empty(request.tags_ref[i])) {
                        throw new ValidationError('Tag a position ' + i + ' ref field is empty');
                    } 
                    let req_tag = formatted(request.tags_ref[i]);
                    let tag = await this.tag_repository.get(req_tag);
                    if (tag == null) {
                        await this.tag_repository.save({ title: req_tag });
                        tags.push(req_tag);
                    } else {
                        tags.push(req_tag);
                    }
                } 
            }
        }

        if (request.price !== null && request.price !== undefined) {
            if (request.price <= 0) {
                throw new ValidationError('The price must be greater than 0');
            }
        }

        if (request.description !== null && request.description !== undefined) {
            if (is_empty(request.description))  {
                throw new ValidationError('Description field is empty');
            }
        }

        if (request.period !== null && request.period !== undefined) {
            if (is_empty(request.period)) {
                throw new ValidationError('Period field is empty');
            }
        }

        if (request.period_time !== null && request.period_time !== undefined) {
            if (request.period_time <= 0) {
                throw new ValidationError('Period time must be greater than 0');
            }
        }

        if (request.period !== null && request.period !== undefined) {
            const period_list = ['Month', 'Week' , 'Year']
            if (!period_list.includes(request.period)) {
                throw new ValidationError('Period must be Week, Month or year');
            }
        }

        let new_id_record = this.crypto.generate_uuid_to_string()

        let is_record_saved = await this.record_repository.update(
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

        let date_end = request.date_start;
        // create end date 
   

        let futur_transaction: dbFutureTransaction = {
            id: this.crypto.generate_uuid_to_string(),
            category_ref: category!.id,
            tag_ref: tags,
            record_ref: new_id_record,
            period: request.period,
            period_time: request.period_time,
            date_end: date_end
        }

        let is_save = await this.future_transaction_repository.save(futur_transaction);
        this.presenter.success(is_save);
    }
}