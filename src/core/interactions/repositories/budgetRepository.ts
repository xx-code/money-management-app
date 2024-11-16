import DateParser from "@/core/entities/date_parser";
import { Period, Budget} from "../../entities/budget";


export type dbBudget = {
    id: string;
    title: string;
    target: number;
    is_periodic: boolean
    is_archived: boolean
    period: Period|null;
    period_time: number|null;
    date_start: DateParser;
    date_to_update: DateParser|null
    date_end: DateParser|null;
    tags: Array<string>;
    categories: Array<string>;
}

export interface BudgetRepository {
    save(request: dbBudget): Promise<boolean>;
    get(id: string): Promise<Budget | null>;
    get_all(): Promise<Budget[]>;
    delete(id: string): Promise<boolean>;
    archived(id: string, balance: number): Promise<boolean>;
    update(request: dbBudget): Promise<Budget>;
}