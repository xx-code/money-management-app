import { Money } from "../helpers"

export class SaveGoal {
    id: string
    account_ref: string
    title: string
    description: string
    target: Money
    items: SaveGoalItem[]

    __add_event_item: SaveGoalItem[] = []
    __del_event_item: string[] = []

    constructor(id: string, title: string, account_ref: string, target: Money) {
        this.id = id
        this.title = title 
        this.account_ref = account_ref
        this.target = target
        this.description = ''
        this.items = []
    }
}
 
export type SaveGoalItem = {
    id: string
    title: string
    link: string
    price: Money
    html_to_track: string
}