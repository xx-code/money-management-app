import DateParser from "@/core/entities/date_parser";
import { BudgetWithCategory, BudgetWithTag, Period } from "../../entities/budget";

export type dbBudgetCategory = {
    id: string;
    title: string;
    target: number;
    period: Period;
    period_time: number;
    categories: Array<string>;
}

export type dbBudgetTag = {
    id: string;
    title: string;
    target: number;
    date_start: DateParser;
    date_end: DateParser;
    tags: Array<string>;
}


export interface BudgetTagRepository {
    save(request: dbBudgetTag): Promise<boolean>;
    get(id: string): Promise<BudgetWithTag | null>;
    get_all(): Promise<BudgetWithTag[]>;
    delete(id: string): Promise<boolean>;
    update(request: dbBudgetTag): Promise<BudgetWithTag>;
}


export interface BudgetCategoryRepository {
    save(request: dbBudgetCategory): Promise<boolean>;
    get(id: string): Promise<BudgetWithCategory | null>;
    get_all(): Promise<BudgetWithCategory[]>;
    delete(id: string): Promise<boolean>;
    update(request: dbBudgetCategory): Promise<BudgetWithCategory>;
}
