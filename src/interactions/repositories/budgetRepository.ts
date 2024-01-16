import { Period } from "../../entities/budget";

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
    date_start: Date;
    date_end: Date;
    tags: Array<string>;
}

export type dbBudgetCategoryResponse = {
    id: string;
    title: string;
    target: number;
    current: number;
    period: Period;
    period_time: number;
    categories: Array<string>;
}

export type dbBudgetTagResponse = {
    id: string;
    title: string;
    target: number;
    current: number;
    date_start: Date;
    date_end: Date;
    tags: Array<string>;
}

export type dbBudgetCategoryUpdate = {
    id: string;
    title: string|null;
    target: number|null;
    period: Period|null;
    period_time: number|null;
    categories: Array<string>|null;
}

export type dbBudgetTagUpdate = {
    id: string;
    title: string|null;
    target: number|null;
    date_start: Date|null ;
    date_end: Date|null;
    tags: Array<string>|null;
}

export interface BudgetRepository {
    save_category(request: dbBudgetCategory): string;
    save_tag(request: dbBudgetTag): string;
    get(id: string): dbBudgetCategoryResponse | dbBudgetTagResponse | null;
    get_all(): Array<dbBudgetCategoryResponse | dbBudgetTagResponse>;
    delete(id: string): boolean;
    update_category(request: dbBudgetCategoryUpdate): dbBudgetCategoryResponse;
    update_tag(request: dbBudgetTagUpdate): dbBudgetTagResponse;
}

