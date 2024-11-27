import { Budget } from "../domains/entities/budget";


export interface BudgetRepository {
    save(request: Budget): Promise<boolean>;
    get(id: string): Promise<Budget | null>;
    getAll(): Promise<Budget[]>;
    delete(id: string): Promise<boolean>;
    archived(id: string, balance: number): Promise<boolean>;
    update(request: Budget): Promise<boolean>;
}