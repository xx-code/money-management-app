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

export interface BudgetTagRepository {
    save(request: dbBudgetTag): string;
    get(id: string): dbBudgetTagResponse | null;
    get_all(): Array<dbBudgetTagResponse>;
    delete(id: string): boolean;
    update(request: dbBudgetTagUpdate): dbBudgetTagResponse;
}


export interface BudgetCategoryRepository {
    save(request: dbBudgetCategory): string;
    get(id: string): dbBudgetCategoryResponse | null;
    get_all(): Array<dbBudgetCategoryResponse>;
    delete(id: string): boolean;
    update(request: dbBudgetCategoryUpdate): dbBudgetCategoryResponse
}
