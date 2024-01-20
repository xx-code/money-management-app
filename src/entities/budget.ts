export enum Period {
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    Year = 'Year'
} 

export type BudgetWithCategory = {
    title: string;
    target: number;
    period: Period;
    period_time: number;
    categories: Array<string>
}

export type BudgetWithTag = {
    title: string;
    target: number;
    date_start: Date;
    date_end: Date;
    tags: Array<string>;
}

export type BudgetWithCategoryDisplay = {
    id: string;
    title: string;
    target: number;
    current: number;
    period: string;
    period_time: number;
    categories: Array<string>
}

export type BudgetWithTagDisplay = {
    title: string;
    target: number;
    current: number;
    date_start: Date;
    date_end: Date;
    tags: Array<string>;
}