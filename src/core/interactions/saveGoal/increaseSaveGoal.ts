import { CryptoService } from "@/core/adapters/libs";
import { AccountRepository } from "../../repositories/accountRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { RecordRepository } from "../../repositories/recordRepository";
import { SavingRepository } from "../../repositories/savingRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { DateParser, isEmpty, Money } from "@/core/domains/helpers";
import ValidationError from "@/core/errors/validationError";
import { SAVING_CATEGORY_ID } from "@/core/domains/constants";
import { Category } from "@/core/domains/entities/category";
import { Record, Transaction, TransactionType } from "@/core/domains/entities/transaction";


export type RequestIncreaseSaveGoal = {
    saving_goal_ref: string;
    account_ref: string;
    increase_amount: number;
}

export interface IIncreaseSaveGoalUseCase {
    execute(request: RequestIncreaseSaveGoal): void
}

export interface IIncreaseSaveGoalPresenter {
    success(is_save: boolean): void;
    fail(err: Error): void;
}

export class IncreaseSaveGoalUseCase implements IIncreaseSaveGoalUseCase {

    private saving_repository: SavingRepository
    private account_repository: AccountRepository
    private transaction_repository: TransactionRepository;
    private record_repository: RecordRepository;
    private category_repository: CategoryRepository;
    private crypto: CryptoService;
    private presenter: IIncreaseSaveGoalPresenter;

    constructor(presenter: IIncreaseSaveGoalPresenter, account_repo: AccountRepository, saving_repo: SavingRepository, transaction_repo: TransactionRepository,  category_repo: CategoryRepository, record_repo: RecordRepository, crypto: CryptoService) {
        this.presenter = presenter
        this.account_repository = account_repo
        this.saving_repository = saving_repo
        this.transaction_repository = transaction_repo
        this.category_repository = category_repo
        this.record_repository = record_repo
        this.crypto = crypto
    }

    async execute(request: RequestIncreaseSaveGoal): Promise<void> {
        try {

            if (isEmpty(request.saving_goal_ref)) {
                throw new ValidationError('Saving must not be empty')
            }

            let saving_goal = await this.saving_repository.get(request.saving_goal_ref)

            if (saving_goal === null) {
                throw new ValidationError('Saving goal dont exist')
            }

            let account = await this.account_repository.get(request.account_ref)
            if (account === null) {
                throw new ValidationError('Account do not exist')
            }

            let increase_amount = new Money(request.increase_amount)

            let account_balance = await this.transaction_repository.getBalance({
                accounts: [account.id],
                categories: [],
                tags: [],
                start_date: undefined,
                end_date: undefined,
                price: undefined,
                type: undefined
            })

            if (account_balance < increase_amount.getAmount()) {
                throw new ValidationError('Price must be smaller than account')
            }

            let category = await this.category_repository.get(SAVING_CATEGORY_ID);

            if (category === null) {
                let new_category = new Category(
                    SAVING_CATEGORY_ID,
                    'Saving',
                    '#2ecc71'
                )
                let is_category_saved = await this.category_repository.save(new_category);

                if (!is_category_saved) {
                    throw new ValidationError('Error while creating category saving');
                }
            }

            let id_record_from = this.crypto.generate_uuid_to_string()
            let new_record_from = new Record(id_record_from, increase_amount, DateParser.now(), TransactionType.DEBIT)
            new_record_from.description = 'Saving ' + saving_goal.title
            if (!await this.record_repository.save(new_record_from)) {
                throw new ValidationError('Error while saving record Sender');
            }

            let id_record_saving = this.crypto.generate_uuid_to_string() 
            let new_record_saving = new Record(id_record_saving, increase_amount, DateParser.now(), TransactionType.CREDIT)
            new_record_saving.description = 'Saving ' + saving_goal.title
            if (!await this.record_repository.save(new_record_saving)) {
                throw new ValidationError('Error while saving record saving');
            }

            let id_trans_from = this.crypto.generate_uuid_to_string()
            let new_transaction_from = new Transaction(id_trans_from, request.account_ref, id_record_from, SAVING_CATEGORY_ID)
            let is_saved_from = await this.transaction_repository.save(new_transaction_from);

            let is_save = false
            if (is_saved_from) {
                let id_trans_to = this.crypto.generate_uuid_to_string()
                let new_transaction_to = new Transaction(id_trans_to, saving_goal.account_ref, id_record_saving, SAVING_CATEGORY_ID)
                is_save = await this.transaction_repository.save(new_transaction_to);
            }
            
            this.presenter.success(is_save);
        } catch (err: any) {
            this.presenter.fail(err)
        }
    }
}