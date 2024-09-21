import { ValidationError } from "@/core/errors/validationError";
import { SavingRepository } from "../repositories/savingRepository";
import { is_empty } from "@/core/entities/verify_empty_value";

export type RequestUpdateSaveGoal = {
    saving_goal_ref: string;
    target: number|null,
    title: string|null,
    description: string|null
}

export interface IUpdateSaveGoalUseCase {
    execute(request: RequestUpdateSaveGoal): void
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

    async execute(request: RequestUpdateSaveGoal): Promise<void> {
        try {
            let saving_goal = await this.saving_repo.get(request.saving_goal_ref)

            if (saving_goal === null) {
                throw new ValidationError('Saving goal not exist')
            }

            if (request.title !== null) {
                if (is_empty(request.title)) {
                    throw new ValidationError('Title is empty')
                }

                saving_goal.title = request.title
            }

            if (request.description !== null) {
                saving_goal.description = request.description
            }

            if (request.target !== null) {
                if (request.target <= 0) {
                    throw new ValidationError('price must be greater 0')
                }
                saving_goal.target = request.target
            }

            let is_update = await this.saving_repo.update({
                id: saving_goal.id,
                description: saving_goal.description,
                target: saving_goal.target,
                title: saving_goal.title
            })

            this.presenter.success(is_update)
        } catch(err: any) {
            this.presenter.fail(err)
        }
    }
}