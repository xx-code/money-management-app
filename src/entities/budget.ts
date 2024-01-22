export enum Period {
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    Year = 'Year'
} 

type Budget = {
    title: string;
    target: number;
}

export type BudgetWithCategory = Budget & {
    period: Period;
    period_time: number;
    categories: Array<string>
}

export type BudgetWithTag = Budget & {
    date_start: Date;
    date_end: Date;
    tags: Array<string>;
}

export type BudgetWithCategoryDisplay = Budget & {
    current: number;
    period: string;
    period_time: number;
    categories: Array<string>
}

export type BudgetWithTagDisplay = Budget & {
    current: number;
    date_start: Date;
    date_end: Date;
    tags: Array<string>;
}