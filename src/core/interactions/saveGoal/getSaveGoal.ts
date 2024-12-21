import ValidationError from "@/core/errors/validationError"
import { SavingRepository } from "../../repositories/savingRepository"
import { TransactionRepository } from "../../repositories/transactionRepository"

export type SaveGoalItemResponse = {
    id: string
    title: string
    link: string
    price: number
    html_to_target: string
}

export type SaveGoalResponse = {
    id: string,
    title: string,
    description: string,
    target: number,
    balance: number
    items: SaveGoalItemResponse[] 
}


export interface IGetSaveGoalUseCase {
    execute(id: string): void
}

export interface IGetSaveGoalPresenter {
    success(response: SaveGoalResponse): void;
    fail(err: Error): void;
}

export class GetSaveGoalUseCase implements IGetSaveGoalUseCase {
    private transaction_repository: TransactionRepository
    private saving_repository: SavingRepository
    private presenter: IGetSaveGoalPresenter

    constructor(presenter: IGetSaveGoalPresenter, transaction_repo: TransactionRepository, saving_repo: SavingRepository) {
        this.transaction_repository = transaction_repo
        this.presenter = presenter
        this.saving_repository = saving_repo
    }

    async execute(id: string): Promise<void> {
        try {
            let save_goal = await this.saving_repository.get(id)

            if (save_goal === null) {
                throw new ValidationError('save goal not exist')
            }

            let balance = await this.transaction_repository.getAccountBalance(save_goal.account_ref)

            let response: SaveGoalResponse = {
                id: save_goal.id,
                title: save_goal.title,
                description: save_goal.description,
                balance: balance,
                target: save_goal.target.getAmount(),
                items: save_goal.items.map(item => ({id: item.id, title: item.title, link: item.link, price: item.price.getAmount(), html_to_target: item.html_to_track}))
            }

            this.presenter.success(response)
        } catch(err: any) {
            this.presenter.fail(err)
        }
    }
}