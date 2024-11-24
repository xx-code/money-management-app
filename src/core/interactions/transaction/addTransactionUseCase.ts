import { TransactionRepository } from "../../repositories/transactionRepository";
import { AccountRepository } from "../../repositories/accountRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { TagRepository } from "../../repositories/tagRepository";
import { RecordRepository } from "../../repositories/recordRepository";
import { CryptoService } from '../../adapters/libs';
import { DateParser, isEmpty, Money } from "@/core/domains/helpers";
import ValidationError from "@/core/errors/validationError";
import { Tag } from "@/core/domains/entities/tag";
import { Record, Transaction } from "@/core/domains/entities/transaction";
import { mapperTransactionType } from "@/core/mappers/transaction";

export type RequestAddTransactionUseCase = {
    account_ref: string;
    amount: number;
    category_ref: string;
    description: string;
    date: string;
    tag_ref: string[];
    new_tags: string[]
    type: string;
}

export interface IAddTransactionUseCase {
    execute(request: RequestAddTransactionUseCase): void;
}

export interface IAddTransactionUseCaseResponse {
    success(success: boolean): void;
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

            if (isEmpty(request.account_ref)) {
                throw new ValidationError('Account ref field is empty');
            }

            let account = await this.account_repository.get(request.account_ref);

            if (account == null) {
                throw new ValidationError('Account not exist');
            } 

            if (isEmpty(request.category_ref)) {
                throw new ValidationError('Category ref field is empty');
            }

            if (isEmpty(request.description)) {
                throw new ValidationError('Description ref field is emtpy');
            }

            let category = await this.category_repository.get(request.category_ref);

            if (category == null) {
                throw new ValidationError('Category not exist');
            }

            let tags = [];
            if (request.tag_ref.length > 0) {
                for(let i = 0; i < request.tag_ref.length; i++) {
                    let tag = await this.tag_repository.get(request.tag_ref[i])
                    if (isEmpty(tag)) 
                        throw new ValidationError('tag ref ' + request.tag_ref[i] + ' not exist')
                    
                    tags.push(request.tag_ref[i])
                } 
            }

            if (request.new_tags.length > 0) {
                for(let i = 0; i < request.new_tags.length; i++) {
                    if (isEmpty(request.new_tags[i]))
                        throw new ValidationError('A tag have not value')

                    let new_id_tag = this.crypto.generate_uuid_to_string()
                    let is_save = await this.tag_repository.save(new Tag(new_id_tag, request.new_tags[i], null))

                    if (is_save)
                        throw new Error(`Tag ${tags[i]}not saved`)

                    tags.push(new_id_tag)
                }
            }

            let amount = new Money(request.amount)


            let record_id = this.crypto.generate_uuid_to_string();
            let new_record = new Record(record_id, amount, DateParser.fromString(request.date), mapperTransactionType(request.type))
            new_record.description = request.description
            let is_record_saved = await this.record_repository.save(new_record);

            if (!is_record_saved) {
                throw new Error('New record not created');
            }
            
            let new_transaction = new Transaction(new_id, request.account_ref, new_record.id, request.category_ref)
            new_transaction.setTags(tags)
    

            let is_save = await this.transaction_repository.save(new_transaction);

            this.presenter.success(is_save);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}