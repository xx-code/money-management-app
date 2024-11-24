import { Money } from "../helpers"

export class SaveGoal {
    id: string
    account_ref: string
    title: string
    description: string
    target: Money
    // items: SaveGoalItem[]

    constructor(id: string, title: string, account_ref: string, target: Money) {
        this.id = id
        this.title = title 
        this.account_ref = account_ref
        this.target = target
        this.description = ''
    }
}

// Todo: to have a list to handle list of items i have to buy and html link to vise 
// export type SaveGoalItem = {
//     title: string
//     link: string
//     price: Money
//     html_to_track: string
// }