import { SavingRepository } from "../../repositories/savingRepository"
import { TransactionRepository } from "../../repositories/transactionRepository"

export interface IGetAllSaveGoal {
    execute(): void
}

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
    balance: number,
    items: SaveGoalItemResponse[]
}

export interface IGetAllSaveGoalPresenter {
    success(response: SaveGoalResponse[]): void;
    fail(err: Error): void;
}

export class GetAllSaveGoal implements IGetAllSaveGoal {
    private transaction_repository: TransactionRepository
    private saving_repository: SavingRepository
    private presenter: IGetAllSaveGoalPresenter

    constructor(presenter: IGetAllSaveGoalPresenter, transaction_repo: TransactionRepository, saving_repo: SavingRepository) {
        this.transaction_repository = transaction_repo
        this.presenter = presenter
        this.saving_repository = saving_repo
    }

    async execute(): Promise<void> {
        try {
            let save_goals = await this.saving_repository.getAll()

            let responses: SaveGoalResponse[] = [] 

            for(let save_goal of save_goals) {
                let balance = await this.transaction_repository.getAccountBalance(save_goal.account_ref)

                responses.push(
                    {
                        id: save_goal.id,
                        title: save_goal.title,
                        description: save_goal.description,
                        balance: balance,
                        target: save_goal.target.getAmount(),
                        items: save_goal.items.map(item => ({id: item.id, title: item.title, link: item.link, price: item.price.getAmount(), html_to_target: item.html_to_track}))
                    }
                ) 
            }

            this.presenter.success(responses)
        } catch(err: any) {
            this.presenter.fail(err)
        }
    }
}