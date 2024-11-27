import { NotFoundError } from "../../errors/notFoundError";
import { RecordRepository } from "../../repositories/recordRepository";
import { AccountRepository } from "../../repositories/accountRepository";
import { TagRepository } from "../../repositories/tagRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { DateParser, isEmpty, Money } from "@/core/domains/helpers";
import ValidationError from "@/core/errors/validationError";
import { mapperTransactionType } from "@/core/mappers/transaction";
import { CryptoService } from "@/core/adapters/libs";
import { Tag } from "@/core/domains/entities/tag";

export type RequestUpdateTransactionUseCase = {
    id: string;
    account_ref: string|null;
    tags_ref: string[]|null;
    new_tags_ref: string[]
    category_ref: string|null;
    type: string|null;
    description: string|null;
    date: string|null;
    amount: number|null;
}

interface IUpdateTransactionUseCase {
    execute(request: RequestUpdateTransactionUseCase): void
}

export interface IUpdateTransactionUseCaseResponse {
    success(success: boolean): void
    fail(err: Error): void
}

export interface IUpdateTransactionAdapter {
    transaction_repository: TransactionRepository
    category_repository: CategoryRepository
    tag_repository: TagRepository
    record_repository: RecordRepository
    account_repository: AccountRepository
    crypto: CryptoService
}


export class UpdateTransactionUseCase implements IUpdateTransactionUseCase {
    private transaction_repository: TransactionRepository;
    private record_repository: RecordRepository;
    private category_repository: CategoryRepository;
    private tag_repository: TagRepository;
    private account_repository: AccountRepository;
    private crypto: CryptoService;

    private presenter: IUpdateTransactionUseCaseResponse;

    constructor(adapter: IUpdateTransactionAdapter, presenter: IUpdateTransactionUseCaseResponse,) {
        this.transaction_repository = adapter.transaction_repository;
        this.record_repository = adapter.record_repository;
        this.category_repository = adapter.category_repository;
        this.tag_repository = adapter.tag_repository;
        this.account_repository = adapter.account_repository;
        this.presenter = presenter;
        this.crypto = adapter.crypto
    }
    

    async execute(request: RequestUpdateTransactionUseCase): Promise<void> {
        try {
            let transaction = await this.transaction_repository.get(request.id);
            
            if (transaction == null) {
                throw new NotFoundError('Transaction not found')
            }

            let record = await this.record_repository.get(transaction.record_ref)

            if (record === null)
                throw new NotFoundError('Can\'t found record')

            
            if (!isEmpty(request.account_ref)) {
                let account = await this.account_repository.get(request.account_ref!)

                if (account === null) {
                    throw new ValidationError('The account do not exist')
                }
                transaction.account_ref = request.account_ref!                
            }
            
            if (!isEmpty(request.description != null)) {
                record.description = request.description!
            }

            if (!isEmpty(request.amount)) {
                record.amount = new Money(request.amount!)
            }

            // TODO: Clean transaction type
            if (!isEmpty(request.type)) {
                record.type = mapperTransactionType(request.type!)
            }

            if (!isEmpty(request.date)) {
                record.date = DateParser.fromString(request.date!);
            }

            if (!isEmpty(request.category_ref)) {
                let new_category = await this.category_repository.get(request.category_ref!);
                if (new_category == null) {
                    throw new ValidationError('Category not exist');
                }
                transaction.category_ref = new_category.id;
            }

            if (!isEmpty(request.tags_ref)) {
                for (let tag_ref of transaction.getTags()) {
                    if (request.tags_ref!.includes(tag_ref))
                        transaction.deleteTag(tag_ref) 
                }
            }

            if (isEmpty(request.new_tags_ref)) {
                for(let i = 0; i < request.new_tags_ref.length; i++) {
                    if (isEmpty(request.new_tags_ref[i]))
                        throw new ValidationError('A tag have not value')

                    let new_id_tag = this.crypto.generate_uuid_to_string()
                    let is_save = await this.tag_repository.save(new Tag(new_id_tag, request.new_tags_ref[i], null))

                    if (is_save)
                        throw new Error(`Tag ${request.new_tags_ref[i]}not saved`)

                    transaction.addTag(new_id_tag)
                }
            }

            let is_record_update = await this.record_repository.update(record);

            if (!is_record_update)
                throw new Error('We cannot update record') 
            
            let is_transaction_update = await this.transaction_repository.update(transaction);

            this.presenter.success(is_transaction_update);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}