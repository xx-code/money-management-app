import { Transaction, TransactionType } from "../../entities/transaction";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { RecordRepository } from "../repositories/recordRepository";
import { AccountRepository } from "../repositories/accountRepository";
import { TagRepository } from "../repositories/tagRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { formatted, reverseFormatted } from "../../entities/formatted";
import { is_empty } from "../../entities/verify_empty_value";
import { TransactionRepository } from "../repositories/transactionRepository";
import DateParser from "@/core/entities/date_parser";

export type RequestUpdateTransactionUseCase = {
    id: string;
    tag_ref: string|null;
    category_ref: string|null;
    type: TransactionType|null;
    description: string|null;
    date: string|null;
    price: number|null;
}

interface IUpdateTransactionUseCase {
    execute(request: RequestUpdateTransactionUseCase): void
}

export interface IUpdateTransactionUseCaseResponse {
    success(transaction: Transaction): void
    fail(err: Error): void
}

export class UpdateTransactionUseCase implements IUpdateTransactionUseCase {
    private transaction_repository: TransactionRepository;
    private record_repository: RecordRepository;
    private category_repository: CategoryRepository;
    private tag_repository: TagRepository;
    private account_repository: AccountRepository;

    private presenter: IUpdateTransactionUseCaseResponse;

    constructor(transaction_repo: TransactionRepository, presenter: IUpdateTransactionUseCaseResponse, account_repo: AccountRepository, category_repo: CategoryRepository, tag_repo: TagRepository, record_repo: RecordRepository) {
        this.transaction_repository = transaction_repo;
        this.record_repository = record_repo;
        this.category_repository = category_repo;
        this.tag_repository = tag_repo;
        this.account_repository = account_repo;
        this.presenter = presenter;
    }

    async execute(request: RequestUpdateTransactionUseCase): Promise<void> {
        try {
            let transaction = await this.transaction_repository.get(request.id);
            
            if (transaction == null) {
                throw new NotFoundError('Transaction not found');
            }

            let record = transaction.record;
            let category_ref = transaction.category.id;
            let tags: string[] = [];

            if (request.description != null) {
                if (is_empty(request.description)) {
                    throw new ValidationError('Description ref field is emtpy');
                }
                record.description = request.description;
            }

            if (request.price != null) {
                if (request.price < 0) {
                    throw new ValidationError('Price must be greather to 0');
                }
                record.price = request.price;
            }

            // TODO: Clean transaction type
            if (request.type != null) {
                if (formatted(request.type) != 'CREDIT' && formatted(request.type) != 'DEBIT') {
                    throw new ValidationError('Type must be Debit or Credit');
                }
                record.type = request.type;
            }

            let date: DateParser = transaction.record.date
            if (request.date !== null && request.date !== undefined && !is_empty(request.date)) {
                date = DateParser.from_string(request.date);
            }

            if (request.category_ref != null) {
                // category = formatted(request.category_ref);
                if (is_empty(request.category_ref)) {
                    throw new ValidationError('Category ref field is empty');
                }

                let new_category = await this.category_repository.get(request.category_ref);
                if (new_category == null) {
                    throw new ValidationError('Category not exist');
                }
                category_ref = new_category.id;
            }

            if (request.tag_ref != null) {
                for (let i = 0; i < request.tag_ref.length; i++) {
                    if (is_empty(request.tag_ref[i])) {
                        throw new ValidationError('Tag a position ' + i + ' ref field is empty');
                    } 
                    let req_tag = formatted(request.tag_ref[i]);
                    let tag = await this.tag_repository.get(req_tag);
                    if (tag == null) {
                        await this.tag_repository.save({ title: req_tag });
                        tags.push(req_tag);
                    } else {
                        tags.push(req_tag);
                    }

                }
            }

            let record_updated = await this.record_repository.update({
                id: record.id,
                price: record.price,
                description: record.description,
                date: date,
                type: record.type
            });

            let response = await this.transaction_repository.update({
                id: transaction.id,
                account_ref: transaction.account.id,
                category_ref: category_ref,
                tag_ref: tags,
                record_ref: record_updated.id
            });

            this.presenter.success(response);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}