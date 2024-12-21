export type SaveGoalItemModel = {
    id: string
    title: string
    link: string
    htmlToTarget: string
    price: number
}

export type SaveGoalModel = {
    id: string,
    title: string,
    description: string,
    target: number,
    balance: number
    items: SaveGoalItemModel[]
}