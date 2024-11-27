import { RecordRepository } from "../../repositories/recordRepository";
import { AccountRepository } from "../../repositories/accountRepository";
import { TagRepository } from "../../repositories/tagRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { CryptoService } from "@/core/adapters/libs";
import ValidationError from "@/core/errors/validationError";
import { Record, Transaction, TransactionType } from "@/core/domains/entities/transaction";
import { DateParser, isEmpty, Money } from "@/core/domains/helpers";
import { TRANSFERT_CATEGORY_ID } from "@/core/domains/constants";
import { Category } from "@/core/domains/entities/category";

export type RequestTransfertTransactionUseCase = {
    account_id_from: string;
    account_id_to: string;
    date: string;
    amount: number;
}

interface IUpdateTransactionUseCase {
    execute(request: RequestTransfertTransactionUseCase): void
}

export interface ITransfertTransactionUseCaseResponse {
    success(isTransfert: boolean): void
    fail(err: Error): void
}

export interface ITransfertTransactionAdapter {
    transaction_repository: TransactionRepository
    record_repository: RecordRepository
    category_repository: CategoryRepository
    account_repository: AccountRepository
    crypto: CryptoService
}

export class TransfertTransactionUseCase implements IUpdateTransactionUseCase {
    private transaction_repository: TransactionRepository;
    private record_repository: RecordRepository;
    private category_repository: CategoryRepository;
    private account_repository: AccountRepository;
    private crypto: CryptoService;

    private presenter: ITransfertTransactionUseCaseResponse;

    constructor(adapter: ITransfertTransactionAdapter, presenter: ITransfertTransactionUseCaseResponse) {
        this.transaction_repository = adapter.transaction_repository;
        this.record_repository = adapter.record_repository;
        this.category_repository = adapter.category_repository;
        this.account_repository = adapter.account_repository;
        this.presenter = presenter;
        this.crypto = adapter.crypto;
    }

    async execute(request: RequestTransfertTransactionUseCase): Promise<void> {
        try {

            let account_from = await this.account_repository.get(request.account_id_from);

            if (account_from === null) {
                throw new ValidationError('Send account don\'t existe');
            }
 
            let account_to = await this.account_repository.get(request.account_id_to);

            if (account_to === null) {
                throw new ValidationError('Received account don\'t existe');
            }

            
            if (!isEmpty(request.date))
                throw new ValidationError('date must not be empty')

            let date = DateParser.fromString(request.date)

            let balance = await this.transaction_repository.getBalance({
                accounts: [account_from.id],
                categories: [],
                end_date: null,
                price: null,
                start_date: null,
                tags: [],
                type: null
            })

            let amount = new Money(request.amount)

            if (balance < amount.getAmount()) {
                throw new ValidationError('Price must be less than balance from 0');
            }
    

            
            let id_from_record = this.crypto.generate_uuid_to_string() 
            let from_record: Record = new Record(id_from_record, amount, date, TransactionType.DEBIT)
            from_record.description = `Transfert du compte ${account_from.title}`

            let id_to_record = this.crypto.generate_uuid_to_string()
            let to_record: Record = new Record(id_to_record, amount, date, TransactionType.CREDIT)
            to_record.description = `Transfert au compte ${account_to.title}`

            let category = await this.category_repository.get(TRANSFERT_CATEGORY_ID);

            if (category === null) {
                let new_category = new Category(TRANSFERT_CATEGORY_ID, 'Transfert', 'transfert')
                let is_category_saved = await this.category_repository.save(new_category);

                if (!is_category_saved) {
                    throw new ValidationError('Error while creating category transfert');
                }
            }

            let is_record_from_saved = await this.record_repository.save(from_record);
            if (!is_record_from_saved) {
                throw new ValidationError('Error while saving record Sender');
            }

            let is_record_to_saved = await this.record_repository.save(to_record);
            if (!is_record_to_saved) {
                throw new ValidationError('Error while saving record Received');
            }

            let id_trans_from = this.crypto.generate_uuid_to_string()
            let trans_from = new Transaction(id_trans_from, account_from.id, from_record.id, TRANSFERT_CATEGORY_ID)
            let is_saved_from = await this.transaction_repository.save(trans_from);

            if (!is_saved_from)
                throw new ValidationError('Transaction from not save')

            let id_trans_to = this.crypto.generate_uuid_to_string()
            let trans_to = new Transaction(id_trans_to, account_from.id, from_record.id, TRANSFERT_CATEGORY_ID)
            let is_saved_to = await this.transaction_repository.save(trans_to);

            if (!is_saved_to)
                throw new ValidationError('Transaction to not save')

            this.presenter.success(is_saved_from && is_saved_to);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}