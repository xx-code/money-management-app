import { isEmpty, Money } from "@/core/domains/helpers";
import { AccountRepository } from "../../repositories/accountRepository";
import { SavingRepository } from "../../repositories/savingRepository";
import { CryptoService } from "@/core/adapters/libs";
import ValidationError from "@/core/errors/validationError";
import { Account } from "@/core/domains/entities/account";
import { SaveGoal, SaveGoalItem } from "@/core/domains/entities/saveGoal";

export type RequestAddItemSaveGoalUseCase = {
    title: string
    price: number
    link: string
    html_to_track: string
}
export type RequestAddSaveGoalUseCase = {
    target: number;
    title: string;
    description: string
    items: RequestAddItemSaveGoalUseCase[]
}

export interface IAddSaveGoalUseCase {
    execute(request: RequestAddSaveGoalUseCase): void
}

export interface IAddSaveGoalPresenter {
    success(is_save: boolean): void;
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

    async execute(request: RequestAddSaveGoalUseCase): Promise<void> {
        try {
            let id = this.crypt.generate_uuid_to_string();
            
            if (isEmpty(request.title)) {
                throw new ValidationError('Title of saving is empty');
            }

            let account_id = this.crypt.generate_uuid_to_string()
            let new_account = new Account(account_id, request.title)
            new_account.is_saving = true
            let is_save_account = await this.account_repository.save(new_account)

            if (!is_save_account) {
                throw new ValidationError('Can\'t create an account')
            }

            let items: SaveGoalItem[] = []
            for(let item_request of request.items) {
                if (isEmpty(item_request.title))
                        throw new ValidationError("Can't set an item without title")
                let item_id = this.crypt.generate_uuid_to_string()
                items.push({
                    id: item_id,
                    title: item_request.title,
                    link: item_request.link,
                    html_to_track: item_request.html_to_track,
                    price: new Money(item_request.price)
                })
            }

            let money = new Money(request.target)
            let new_save_goal = new SaveGoal(id, request.title, account_id, money)
            new_save_goal.items = items
            
            let is_saved = await this.saving_repository.create(new_save_goal)
            
            this.presenter.success(is_saved)
        } catch (err: any) {
            this.presenter.fail(err as Error);
        } 
    }
}