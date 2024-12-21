import ValidationError from "@/core/errors/validationError";
import { SavingRepository } from "../../repositories/savingRepository";
import { isEmpty, Money } from "@/core/domains/helpers";
import { CryptoService } from "@/core/adapters/libs";

export type RequestUpdateItemSaveGoalUseCase = {
    id: string,
    title: string,
    link: string,
    html_to_track: string
    price: number
}

export type RequestUpdateSaveGoalUseCase = {
    saving_goal_ref: string;
    target: number|null,
    title: string|null,
    description: string|null
    items: RequestUpdateItemSaveGoalUseCase[] | null
}

export interface IUpdateSaveGoalUseCase {
    execute(request: RequestUpdateSaveGoalUseCase): void
}

export interface IUpdateSaveGoalPresenter {
    success(isSave: boolean): void;
    fail(err: Error): void;
}

export class UpdateSaveGoalUseCase implements IUpdateSaveGoalUseCase {
    private saving_repo: SavingRepository
    private presenter: IUpdateSaveGoalPresenter
    private crypto: CryptoService

    constructor(presenter: IUpdateSaveGoalPresenter, saving_repo: SavingRepository, crypto: CryptoService) {
        this.presenter = presenter
        this.saving_repo = saving_repo
        this.crypto = crypto
    }

    async execute(request: RequestUpdateSaveGoalUseCase): Promise<void> {
        try {
            let saving_goal = await this.saving_repo.get(request.saving_goal_ref)

            if (saving_goal === null) {
                throw new ValidationError('Saving goal not exist')
            }

            if (!isEmpty(request.title)) 
                saving_goal.title = request.title!

            if (!isEmpty(request.description))
                saving_goal.description = request.description!

            if (!isEmpty(request.target)) 
                saving_goal.target = new Money(request.target!) 

            if (request.items !== null) {
                for(let item of saving_goal.items) {
                    let index = request.items.findIndex(el => el.id === item.id)
                    if (index === -1) {
                        saving_goal.__del_event_item.push(item.id)
                    } 
                }

                for (let item of request.items) {
                    if (isEmpty(item.id)) {
                        saving_goal.__add_event_item.push(
                            {
                                id: this.crypto.generate_uuid_to_string(),
                                html_to_track: item.html_to_track,
                                link: item.link,
                                price: new Money(item.price),
                                title: item.title
                            }
                        )
                    } else  {
                        // todo add update item
                    }
                }
            } 
            
            let is_update = await this.saving_repo.update(saving_goal)

            this.presenter.success(is_update)
        } catch(err: any) {
            this.presenter.fail(err)
        }
    }
}