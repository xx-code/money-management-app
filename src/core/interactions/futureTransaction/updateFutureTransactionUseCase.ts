import DateParser from "@/core/entities/date_parser";
import { CategoryRepository } from "../repositories/categoryRepository";
import { RecordRepository } from "../repositories/recordRepository";
import { FutureTransactionRepository, dbFutureTransaction } from "../repositories/futureTransactionRepository";
import { Category } from "@/core/entities/category";
import { ValidationError } from "@/core/errors/validationError";
import { TransactionType, Record} from "@/core/entities/transaction";
import { Period } from '../../entities/budget';
import { is_empty } from "@/core/entities/verify_empty_value";
import { formatted } from "@/core/entities/formatted";
import { CryptoService } from "@/core/adapter/libs";
import { FutureTransaction, determined_end_date_with } from "@/core/entities/future_transaction";
import { TagRepository } from "../repositories/tagRepository";
import { AccountRepository } from "../repositories/accountRepository";
import { Account } from "@/core/entities/account";

export type RequestUpdateFutureTransaction = {
    id: string;
    account_ref: string | null | undefined;
    category_ref: string | null | undefined;
    tags_ref: string[] | null | undefined;
    description: string | null | undefined;
    price: number | null | undefined;
    type_record: TransactionType | null | undefined;
    period: string | null | undefined;
    period_time: number | null | undefined;
    repeat: number | null | undefined;
    date_start: string | null;
}

export interface IUpdateFutureTransactionUseCase {
    execute(request: RequestUpdateFutureTransaction): void
}

export interface IUpdateFutureTransactionPresenter {
    success(updated_future_trans: FutureTransaction): void;
    fail(err: Error): void;
}

export class UpdateFutureTransactionUseCase implements IUpdateFutureTransactionUseCase {
    private category_repository: CategoryRepository;
    private record_repository: RecordRepository;
    private future_transaction_repository: FutureTransactionRepository;
    private account_repository: AccountRepository;
    private tag_repository: TagRepository;
    private presenter: IUpdateFutureTransactionPresenter;

    constructor(category_repository: CategoryRepository, record_repository: RecordRepository, tag_repository: TagRepository, 
        future_transaction_repository: FutureTransactionRepository, presenter: IUpdateFutureTransactionPresenter, account_repository: AccountRepository) {
            this.category_repository = category_repository;
            this.record_repository = record_repository;
            this.future_transaction_repository = future_transaction_repository;
            this.tag_repository = tag_repository;
            this.presenter = presenter;
            this.account_repository = account_repository;
    }

    async execute(request: RequestUpdateFutureTransaction): Promise<void> {
        try {
            let future_transaction: FutureTransaction | null =  await this.future_transaction_repository.get(request.id)

            if (future_transaction === null) {
                throw new ValidationError('Future transaction d\'ont existe');
            }

            let record: Record = future_transaction.record;
            let categorie_ref: string = future_transaction.category.id
            let account_ref: string = future_transaction.account.id
            let tags: string[] = []
            
            if (request.account_ref !== null && request.account_ref !== undefined) {
                let account: Account|null = await this.account_repository.get(request.account_ref);
                if (account == null) {
                    throw new ValidationError('Account don\'t exist');
                }
                account_ref = request.account_ref
            }

            if (request.category_ref !== null && request.category_ref !== undefined) {
                let category: Category|null = await this.category_repository.get(request.category_ref);
                if (category === null) {
                    throw new ValidationError('Category not found');
                }
                categorie_ref = request.category_ref
            }

            // Todo: work on tag repository for update
            if (request.tags_ref !== null && request.tags_ref !== undefined) {
                if (request.tags_ref.length > 0) {
                    for(let i = 0; i < request.tags_ref.length; i++) {
                        if (is_empty(request.tags_ref[i])) {
                            throw new ValidationError('Tag a position ' + i + ' ref field is empty');
                        } 
                        let req_tag = formatted(request.tags_ref[i]);
                        let tag = await this.tag_repository.get(req_tag);
                        if (tag !== null) {
                            tags.push(req_tag);
                        } else {
                            throw new ValidationError("The tag must exist");
                        }
                    } 
                }
            }


            if (request.price !== null && request.price !== undefined) {
                if (request.price <= 0) {
                    throw new ValidationError('The price must be greater than 0');
                }
                record.price = request.price
            }

            if (request.description !== null && request.description !== undefined) {
                if (is_empty(request.description))  {
                    throw new ValidationError('Description field is empty');
                }

                record.description = request.description
            }

            if (request.period !== null && request.period !== undefined) {
                if (is_empty(request.period)) {
                    throw new ValidationError('Period field is empty');
                }

                future_transaction.period = <Period>request.period
            }

            if (request.period_time !== null && request.period_time !== undefined) {
                if (request.period_time <= 0) {
                    throw new ValidationError('Period time must be greater than 0');
                }

                future_transaction.period_time = request.period_time
            }

            if (request.period !== null && request.period !== undefined) {
                const period_list = ['Month', 'Week' , 'Year', 'Day']
                if (!period_list.includes(request.period)) {
                    throw new ValidationError('Period must be Week, Month or year');
                }
            }

            let date_start: DateParser = future_transaction.date_start
            if (request.date_start !== null && request.date_start !== undefined) {
                date_start = DateParser.from_string(request.date_start);
                future_transaction.date_update = determined_end_date_with(date_start.toDate(), future_transaction.period, future_transaction.period_time);
            }

            let is_record_updated = await this.record_repository.update(
                {
                    id: record.id,
                    price: record.price,
                    description: record.description,
                    type: record.type,
                    date: record.date,
                }
            )

            if (!is_record_updated) {
                throw new Error("We can't update the future record");
            }

            if (request.repeat !== null && request.repeat !== undefined) {
                if (request.repeat <= 0) {
                    throw new ValidationError("The repeat number must be greater than 0")
                }
                future_transaction.repeat = request.repeat;
            }   

            const can_update_date_end = (request.repeat !== null && request.repeat !== undefined) && (request.date_start !== null && request.date_start !== undefined)
            
            if (can_update_date_end) {
                if (future_transaction.repeat !== null) {
                    future_transaction.date_end = determined_end_date_with(date_start!.toDate(), future_transaction.period, future_transaction.period_time, future_transaction.repeat)
                } 
            }
    

            let update_future_transaction: dbFutureTransaction = {
                id: request.id,
                account_ref: account_ref,
                is_archived: future_transaction.is_archived,
                category_ref: categorie_ref,
                tag_ref: tags,
                record_ref: record.id,
                period: future_transaction.period,
                period_time: future_transaction.period_time,
                repeat: future_transaction.repeat,
                date_start: date_start,
                date_update: future_transaction.date_update,
                date_end: future_transaction.date_end
            }

            let response = await this.future_transaction_repository.update(update_future_transaction);
            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}