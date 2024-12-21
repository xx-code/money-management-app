import { SaveGoal } from "../domains/entities/saveGoal"
import { Money } from "../domains/helpers"

export type SaveGoalDto = {
    id: string
    account_ref: string
    title: string
    description: string
    target: number
    items: SaveGoalItemDto[]
}

export type SaveGoalItemDto = {
    id: string
    title: string,
    link: string
    price: number
    html_to_track: string
}

export class SaveGoalMapper {
    static to_domain(dto: SaveGoalDto): SaveGoal {
        let save_goal = new SaveGoal(dto.id, dto.title, dto.account_ref, new Money(dto.target))
        save_goal.description = dto.description
        for(let item of dto.items) {
            save_goal.items.push({
                id: item.id,
                title: item.title,
                link: item.link,
                price: new Money(item.price),
                html_to_track: item.html_to_track
            })
        }

        return save_goal
    }

    static to_persistence(entity: SaveGoal): SaveGoalDto {
        let items_dto: SaveGoalItemDto[] = []
        for (let item_dto of entity.items) {
            items_dto.push({
                id: item_dto.id,
                title: item_dto.title,
                link: item_dto.link,
                html_to_track: item_dto.html_to_track,
                price: item_dto.price.getAmount()
            })
        }
        return {
            id: entity.id,
            account_ref: entity.account_ref,
            title: entity.title,
            description: entity.description,
            target: entity.target.getAmount(),
            items: items_dto
        }
    }
}