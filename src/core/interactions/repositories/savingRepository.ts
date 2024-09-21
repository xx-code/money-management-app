import { SaveGoal } from "@/core/entities/save_goal"

export type dbSaveGoal = {
    id: string,
    title: string,
    description: string
    account_ref: string
    target: number
}

export type dbUpdateSaveGoal = {
    id: string,
    title: string,
    description: string
    target: number
}

export interface SavingRepository {
    create(save_goal: dbSaveGoal): Promise<boolean>
    get(save_goal_id: string): Promise<SaveGoal|null>
    getAll(): Promise<SaveGoal[]>
    update(save_goal: dbUpdateSaveGoal): Promise<boolean>
    delete(save_goal_id: string): Promise<boolean>
}