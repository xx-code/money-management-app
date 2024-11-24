import { CryptoService } from "@/core/adapters/libs";
import { AccountRepository } from "../../repositories/accountRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { RecordRepository } from "../../repositories/recordRepository";
import { TagRepository } from "../../repositories/tagRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import ValidationError from "@/core/errors/validationError";
import { DateParser, isEmpty, Money } from "@/core/domains/helpers";
import { Record, Transaction, TransactionType } from "@/core/domains/entities/transaction";
import { FREEZE_CATEGORY_ID } from "@/core/domains/constants";
import { Category } from "@/core/domains/entities/category";

export type RequestNewFreezeBalance = {
    account_ref: string;
    end_date: string;
    amount: number;
}

export interface IAddFreezeBalanceUseCase {
    execute(request: RequestNewFreezeBalance): void
}

export interface IAddFreezeBalancePresenter {
    success(is_save: boolean): void;
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

            if (isEmpty(request.end_date)) {
                throw new ValidationError('Date start is empty')
            }

            let amount = new Money(request.amount)

            let date: DateParser = DateParser.fromString(request.end_date)

            let record_id = this.crypto.generate_uuid_to_string()
            let new_record = new Record(record_id, amount, date, TransactionType.DEBIT)
            new_record.description = 'Freeze'
          
            let category = await this.category_repository.get(FREEZE_CATEGORY_ID);

            if (category === null) {
                let new_category = new Category(FREEZE_CATEGORY_ID, 'Freeze', 'freeze')
                let is_category_saved = await this.category_repository.save(new_category);

                if (!is_category_saved) {
                    throw new ValidationError('Error while creating category transfert');
                }
            }

            let is_record_saved = await this.record_repository.save(new_record);
            if (!is_record_saved) {
                throw new ValidationError('Error while saving record Sender');
            }

            let id_trans = this.crypto.generate_uuid_to_string()
            let new_transaction = new Transaction(id_trans, account.id, new_record.id, FREEZE_CATEGORY_ID)

            let is_saved = await this.transaction_repository.save(new_transaction)

            this.presenter.success(is_saved);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}