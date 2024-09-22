import { CryptoService } from "@/core/adapter/libs";
import { AccountRepository } from "../repositories/accountRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { RecordRepository } from "../repositories/recordRepository";
import { SavingRepository } from "../repositories/savingRepository";
import { TransactionRepository } from "../repositories/transactionRepository";
import { is_empty } from "@/core/entities/verify_empty_value";
import { ValidationError } from "@/core/errors/validationError";
import { formatted } from "@/core/entities/formatted";
import DateParser from "@/core/entities/date_parser";
import { TransactionType } from "@/core/entities/transaction";

export const SAVING_CATEGORY_ID = 'category-saving'

export type RequestIncreaseSaveGoal = {
    saving_goal_ref: string;
    account_ref: string;
    price: number;
}

export interface IIncreaseSaveGoalUseCase {
    execute(request: RequestIncreaseSaveGoal): void
}

export interface IIncreaseSaveGoalPresenter {
    success(isSave: boolean): void;
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

            if (is_empty(request.saving_goal_ref)) {
                throw new ValidationError('Saving must not be empty')
            }

            let saving_goal = await this.saving_repository.get(request.saving_goal_ref)

            console.log(saving_goal)

            if (saving_goal === null) {
                throw new ValidationError('Saving goal dont exist')
            }

            if (request.price <= 0) {
                throw new ValidationError('Price must be greater than 0')
            }

            let account = await this.account_repository.get(request.account_ref)
            if (account === null) {
                throw new ValidationError('Account do not exist')
            }

            let account_balance = await this.transaction_repository.get_balance({
                accounts: [account.id],
                categories: [],
                tags: [],
                start_date: undefined,
                end_date: undefined,
                price: undefined,
                type: undefined
            })

            if (account_balance < request.price) {
                throw new ValidationError('Price must be smaller than account')
            }

            let category = await this.category_repository.get_by_title(formatted('Saving'));

            if (category === null) {
                let is_category_saved = await this.category_repository.save({
                    id: SAVING_CATEGORY_ID,
                    title: formatted('Saving'),
                    icon: 'Saving'
                });

                if (!is_category_saved) {
                    throw new ValidationError('Error while creating category saving');
                }
            }

            let id_record_from = this.crypto.generate_uuid_to_string()
            let is_record_from_saved = await this.record_repository.save({
                id: id_record_from,
                date: DateParser.now(),
                description: 'Saving ' + saving_goal.title,
                price: request.price,
                type: TransactionType.Debit
            })

            let id_record_saving = this.crypto.generate_uuid_to_string() 
            let is_record_saving_saved = await this.record_repository.save({
                id: id_record_saving,
                date: DateParser.now(),
                description: 'Saving ' + saving_goal.title,
                price: request.price,
                type: TransactionType.Credit
            })

            if (!is_record_from_saved) {
                throw new ValidationError('Error while saving record Sender');
            }

            if (!is_record_saving_saved) {
                throw new ValidationError('Error while saving record saving');
            }

            let is_saved_from = await this.transaction_repository.save({
                id: this.crypto.generate_uuid_to_string(),
                account_ref: request.account_ref,
                category_ref: SAVING_CATEGORY_ID,
                record_ref: id_record_from,
                tag_ref: []
            });

            if (is_saved_from) {
                let is_saved_to = await this.transaction_repository.save({
                    id: this.crypto.generate_uuid_to_string(),
                    account_ref: saving_goal.account_ref,
                    category_ref: SAVING_CATEGORY_ID,
                    record_ref: id_record_saving,
                    tag_ref: []
                });
            }
            

            this.presenter.success(is_saved_from);
        } catch (err: any) {
            this.presenter.fail(err)
        }
    }
}