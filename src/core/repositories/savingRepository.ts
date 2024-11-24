import { SaveGoal } from "../domains/entities/saveGoal"

export type dbUpdateSaveGoal = {
    id: string,
    title: string,
    description: string
    target: number
}

export interface SavingRepository {
    create(save_goal: SaveGoal): Promise<boolean>
    get(save_goal_id: string): Promise<SaveGoal|null>
    getAll(): Promise<SaveGoal[]>
    update(save_goal: dbUpdateSaveGoal): Promise<boolean>
    delete(save_goal_id: string): Promise<boolean>
}