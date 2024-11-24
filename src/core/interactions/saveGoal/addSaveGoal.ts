import { ValidationError } from "@/core/errors/validationError";
import { AccountRepository } from "../../repositories/accountRepository";
import { SavingRepository } from "../../repositories/savingRepository";
import { CryptoService } from "@/core/adapters/libs";
import { is_empty } from "@/core/entities/verify_empty_value";

export type RequestNewSaveGoal = {
    target: number;
    title: string;
    description: string
}

export interface IAddSaveGoalUseCase {
    execute(request: RequestNewSaveGoal): void
}

export interface IAddSaveGoalPresenter {
    success(isSave: boolean): void;
    fail(err: Error): void;
}

export class AddSaveGoalUseCase implements IAddSaveGoalUseCase {
    private saving_repository: SavingRepository
    private account_repository: AccountRepository
    private crypt: CryptoService
    private presenter: IAddSaveGoalPresenter

    constructor(saving_repo: SavingRepository, account_repository: AccountRepository, crypt: CryptoService, presenter: IAddSaveGoalPresenter) {
        this.saving_repository = saving_repo
        this.account_repository = account_repository
        this.crypt = crypt
        this.presenter = presenter
    }

    async execute(request: RequestNewSaveGoal): Promise<void> {
        try {
            let id = this.crypt.generate_uuid_to_string();
            
            if (is_empty(request.title)) {
                throw new ValidationError('Title of saving is empty');
            }

            let account_id = this.crypt.generate_uuid_to_string()
            let is_save_account = await this.account_repository.save({
                id: account_id,
                title: request.title,
                is_saving: true
            })

            if (!is_save_account) {
                throw new ValidationError('Can\'t create an account')
            }

            if (request.target <= 0) {
                throw new ValidationError('Target value must be greater than 0')
            }

            let is_saved = await this.saving_repository.create({
                id: id,
                account_ref: account_id,
                title: request.title,
                description: request.description,
                target: request.target
            })
            
            this.presenter.success(is_saved)
        } catch (err: any) {
            this.presenter.fail(err as Error);
        } 
    }
}