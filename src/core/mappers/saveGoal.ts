import { SaveGoal } from "../domains/entities/saveGoal"
import { Money } from "../domains/helpers"

export type SaveGoalDto = {
    id: string
    account_ref: string
    title: string
    description: string
    target: number
}

export class SaveGoalMapper {
    static to_domain(dto: SaveGoalDto): SaveGoal {
        let save_goal = new SaveGoal(dto.id, dto.title, dto.account_ref, new Money(dto.target))
        save_goal.description = dto.description

        return save_goal
    }

    static to_persistence(entity: SaveGoal): SaveGoalDto {
        return {
            id: entity.id,
            account_ref: entity.account_ref,
            title: entity.title,
            description: entity.description,
            target: entity.target.getAmount()
        }
    }
}