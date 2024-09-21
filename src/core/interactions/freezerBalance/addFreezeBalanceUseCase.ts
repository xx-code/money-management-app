import { CryptoService } from "@/core/adapter/libs";
import { AccountRepository } from "../repositories/accountRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { RecordRepository } from "../repositories/recordRepository";
import { TagRepository } from "../repositories/tagRepository";
import { TransactionRepository } from "../repositories/transactionRepository";
import { ValidationError } from "@/core/errors/validationError";
import { TransactionType } from "@/core/entities/transaction";
import { formatted } from "@/core/entities/formatted";
import { Record } from '../../entities/transaction'
import { is_empty } from "@/core/entities/verify_empty_value";
import DateParser from "@/core/entities/date_parser";

export const FREEZE_CATEGORY_ID = 'category-freeze'

export type RequestNewFreezeBalance = {
    account_ref: string;
    end_date: string;
    price: number;
}

export interface IAddFreezeBalanceUseCase {
    execute(request: RequestNewFreezeBalance): void
}

export interface IAddFreezeBalancePresenter {
    success(isSave: boolean): void;
    fail(err: Error): void;
}


export class AddFreezeBalanceUseCase implements IAddFreezeBalanceUseCase {
    private transaction_repository: TransactionRepository;
    private record_repository: RecordRepository;
    private category_repository: CategoryRepository;
    private account_repository: AccountRepository;
    private crypto: CryptoService;

    private presenter: IAddFreezeBalancePresenter;

    constructor(transaction_repo: TransactionRepository, presenter: IAddFreezeBalancePresenter, account_repo: AccountRepository, category_repo: CategoryRepository, tag_repo: TagRepository, record_repo: RecordRepository, crypto: CryptoService) {
        this.transaction_repository = transaction_repo;
        this.record_repository = record_repo;
        this.category_repository = category_repo;
        this.account_repository = account_repo;
        this.presenter = presenter;
        this.crypto = crypto;
    }

    async execute(request: RequestNewFreezeBalance): Promise<void> {
        try {

            let account = await this.account_repository.get(request.account_ref);

            if (account === null) {
                throw new ValidationError('Account don\'t existe');
            }

            if (request.price <= 0) {
                throw new ValidationError('Price must be greather to 0');
            }

            if (is_empty(request.end_date)) {
                throw new ValidationError('Date start is empty')
            }

            let date: DateParser = DateParser.from_string(request.end_date)

            let new_record: Record = {
                id: this.crypto.generate_uuid_to_string(),
                date: date,
                description: `freeze`,
                type: TransactionType.Debit,
                price: request.price
            }

            let category = await this.category_repository.get_by_title(formatted('freeze'));

            if (category === null) {
                let is_category_saved = await this.category_repository.save({
                    id: FREEZE_CATEGORY_ID,
                    title: formatted('freeze'),
                    icon: 'freeze'
                });

                if (!is_category_saved) {
                    throw new ValidationError('Error while creating category transfert');
                }
            }

            let is_record_saved = await this.record_repository.save(new_record);
            if (!is_record_saved) {
                throw new ValidationError('Error while saving record Sender');
            }


            let is_saved = await this.transaction_repository.save({
                id: this.crypto.generate_uuid_to_string(),
                account_ref: account.id,
                category_ref: FREEZE_CATEGORY_ID,
                record_ref: new_record.id,
                tag_ref: []
            })

            this.presenter.success(is_saved);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}