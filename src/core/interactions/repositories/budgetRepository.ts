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
    save(request: dbBudgetTag): string;
    get(id: string): BudgetWithTag | null;
    get_all(): Array<BudgetWithTag>;
    delete(id: string): string;
    update(request: dbBudgetTag): BudgetWithTag;
}


export interface BudgetCategoryRepository {
    save(request: dbBudgetCategory): string;
    get(id: string): BudgetWithCategory | null;
    get_all(): Array<BudgetWithCategory>;
    delete(id: string): string;
    update(request: dbBudgetCategory): BudgetWithCategory;
}
