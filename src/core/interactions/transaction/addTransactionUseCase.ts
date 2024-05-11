import { TransactionType, is_Transaction_type } from "../../entities/transaction";
import { ValidationError } from "../../errors/validationError";
import { TransactionRepository } from "../repositories/transactionRepository";
import { AccountRepository } from "../repositories/accountRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { TagRepository } from "../repositories/tagRepository";
import { RecordRepository } from "../repositories/recordRepository";
import { CryptoService } from '../../adapter/libs';
import { formatted } from "../../entities/formatted";
import { is_empty } from "../../entities/verify_empty_value";
import DateParser from "@/core/entities/date_parser";

export type RequestAddTransactionUseCase = {
    account_ref: string;
    price: number;
    category_ref: string;
    description: string;
    date: DateParser;
    tag_ref: string[];
    type: TransactionType;
}

export interface IAddTransactionUseCase {
    execute(request: RequestAddTransactionUseCase): void;
}

export interface IAddTransactionUseCaseResponse {
    success(id_transaction: string): void;
    fail(err: Error): void
}

export class AddTransactionUseCase implements IAddTransactionUseCase {
    private transaction_repository: TransactionRepository;
    private record_repository: RecordRepository;
    private category_repository: CategoryRepository;
    private tag_repository: TagRepository;
    private account_repository: AccountRepository;
    private crypto: CryptoService;
    private presenter: IAddTransactionUseCaseResponse

    constructor(transaction_repo: TransactionRepository, record_repo: RecordRepository, category_repo: CategoryRepository, tag_repo: TagRepository, account_repo: AccountRepository, crypto: CryptoService, presenter: IAddTransactionUseCaseResponse) {
        this.transaction_repository = transaction_repo;
        this.record_repository = record_repo;
        this.category_repository = category_repo;
        this.tag_repository = tag_repo;
        this.account_repository = account_repo;
        this.crypto = crypto;
        this.presenter = presenter;
    }

    async execute(request: RequestAddTransactionUseCase): Promise<void> {
        try {
            let new_id = this.crypto.generate_uuid_to_string();

            if (is_empty(request.account_ref)) {
                throw new ValidationError('Account ref field is empty');
            }

            let account = await this.account_repository.get(request.account_ref);

            if (account == null) {
                throw new ValidationError('Account not exist');
            } 

            if (is_empty(request.category_ref)) {
                throw new ValidationError('Category ref field is empty');
            }

            let category = await this.category_repository.get(request.category_ref);

            if (category == null) {
                throw new ValidationError('Category not exist');
            }

            let tags = [];
            if (request.tag_ref.length > 0) {
                for(let i = 0; i < request.tag_ref.length; i++) {
                    if (is_empty(request.tag_ref[i])) {
                        throw new ValidationError('Tag ' + request.tag_ref[i] + 'ref field is empty');
                    }
                    tags.push(formatted(request.tag_ref[i]));
                } 
            }

            for (let i = 0; i < tags.length; i++) {
                if (await this.tag_repository.get(tags[i]) == null) {
                    let is_saved = await this.tag_repository.save({title: tags[i]});

                    if (!is_saved) {
                        throw new Error(`Tag ${tags[i]}not saved`)
                    }
                }
            }

            if (is_empty(request.description)) {
                throw new ValidationError('Description ref field is emtpy');
            }

            if (request.price < 0) {
                throw new ValidationError('Price must be greather to 0');
            }

            let record_id = this.crypto.generate_uuid_to_string();
            let is_record_saved = await this.record_repository.save({
                id: record_id,
                price: request.price,
                date: request.date,
                description: request.description,
                type: request.type
            });

            if (!is_record_saved) {
                throw new Error('New record not created');
            }
            
            await this.transaction_repository.save({
                id: new_id,
                account_ref: request.account_ref,
                category_ref: request.category_ref,
                tag_ref: tags,
                record_ref: record_id
            });

           this.presenter.success(new_id);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}