import { Record } from "./transaction"

export type SaveGoal = {
    id: string
    account_ref: string
    title: string
    description: string
    target: number
}

export type SaveGoalDisplay = {
    id: string
    title: string
    description: string
    target: number
    balance: number
}