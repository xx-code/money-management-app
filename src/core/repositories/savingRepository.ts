import { SaveGoal } from "../domains/entities/saveGoal"


export interface SavingRepository {
    create(save_goal: SaveGoal): Promise<boolean>
    get(save_goal_id: string): Promise<SaveGoal|null>
    getAll(): Promise<SaveGoal[]>
    update(save_goal: SaveGoal): Promise<boolean>
    delete(save_goal_id: string): Promise<boolean>
}