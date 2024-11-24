import { Record, TransactionType } from "../../entities/transaction";
import { ValidationError } from "../../errors/validationError";
import { RecordRepository } from "../../repositories/recordRepository";
import { AccountRepository } from "../../repositories/accountRepository";
import { TagRepository } from "../../repositories/tagRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { formatted } from "../../entities/formatted";
import { TransactionRepository } from "../../repositories/transactionRepository";
import DateParser from "@/core/entities/date_parser";
import { CryptoService } from "@/core/adapters/libs";

export const TRANSFERT_CATEGORY_ID = 'category-transfert'

export type RequestTransfertTransactionUseCase = {
    account_id_from: string;
    account_id_to: string;
    date: DateParser;
    price: number;
}

interface IUpdateTransactionUseCase {
    execute(request: RequestTransfertTransactionUseCase): void
}

export interface ITransfertTransactionUseCaseResponse {
    success(isTransfert: boolean): void
    fail(err: Error): void
}

export class TransfertTransactionUseCase implements IUpdateTransactionUseCase {
    private transaction_repository: TransactionRepository;
    private record_repository: RecordRepository;
    private category_repository: CategoryRepository;
    private account_repository: AccountRepository;
    private crypto: CryptoService;

    private presenter: ITransfertTransactionUseCaseResponse;

    constructor(transaction_repo: TransactionRepository, presenter: ITransfertTransactionUseCaseResponse, account_repo: AccountRepository, category_repo: CategoryRepository, tag_repo: TagRepository, record_repo: RecordRepository, crypto: CryptoService) {
        this.transaction_repository = transaction_repo;
        this.record_repository = record_repo;
        this.category_repository = category_repo;
        this.account_repository = account_repo;
        this.presenter = presenter;
        this.crypto = crypto;
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

            let balance = await this.transaction_repository.get_balance({
                accounts: [account_from.id],
                categories: [],
                end_date: null,
                price: null,
                start_date: null,
                tags: [],
                type: null
            })

            if (balance < request.price) {
                throw new ValidationError('Price must be less than balance from 0');
            }
    
            if (request.price <= 0) {
                throw new ValidationError('Price must be greather to 0');
            }

            let from_record: Record = {
                id: this.crypto.generate_uuid_to_string(),
                date: request.date,
                description: `Transfert du compte ${account_from.title}`,
                type: TransactionType.Debit,
                price: request.price
            }

            let to_record: Record = {
                id: this.crypto.generate_uuid_to_string(),
                date: request.date,
                description: `Transfert au compte ${account_to.title}`,
                type: TransactionType.Credit,
                price: request.price
            }

            let category = await this.category_repository.get_by_title(formatted('Transfert'));

            if (category === null) {
                let is_category_saved = await this.category_repository.save({
                    id: TRANSFERT_CATEGORY_ID,
                    title: formatted('Transfert'),
                    icon: 'transfert'
                });

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

            let is_saved_from = await this.transaction_repository.save({
                id: this.crypto.generate_uuid_to_string(),
                account_ref: account_from.id,
                category_ref: TRANSFERT_CATEGORY_ID,
                record_ref: from_record.id,
                tag_ref: []
            });

            let is_saved_to = await this.transaction_repository.save({
                id: this.crypto.generate_uuid_to_string(),
                account_ref: account_to.id,
                category_ref: TRANSFERT_CATEGORY_ID,
                record_ref: to_record.id,
                tag_ref: []
            });

            this.presenter.success(is_saved_from && is_saved_to);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}