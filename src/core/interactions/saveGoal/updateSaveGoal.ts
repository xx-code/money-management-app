import ValidationError from "@/core/errors/validationError";
import { SavingRepository } from "../../repositories/savingRepository";
import { isEmpty, Money } from "@/core/domains/helpers";

export type RequestUpdateSaveGoalUseCase = {
    saving_goal_ref: string;
    target: number|null,
    title: string|null,
    description: string|null
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

    constructor(presenter: IUpdateSaveGoalPresenter, saving_repo: SavingRepository) {
        this.presenter = presenter
        this.saving_repo = saving_repo
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
            
            let is_update = await this.saving_repo.update(saving_goal)

            this.presenter.success(is_update)
        } catch(err: any) {
            this.presenter.fail(err)
        }
    }
}