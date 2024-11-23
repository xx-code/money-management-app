import { ValidationError } from "../errors/validationError";
import { Category } from "./category";
import DateParser from "./date_parser";
import { Tag } from "./tag";
import { Transaction } from "./transaction";

export type Period =  'Day' | 'Week' | 'Month' | 'Year';

export type TypePeriod = {
    value: string,
    title: string
}
export const typePeriods: TypePeriod[] = [
    {
        value: 'Day',
        title: 'Jour'
    },
    {
        value: 'Week',
        title: 'Semaine'
    },
    {
        value: 'Month',
        title: 'Mois'
    },
    {
        value: 'Year',
        title: 'Annee'
    }
]

export enum BudgetType {
    STANDARD_BUDGET,
    BUDGET_WITH_TIME,
    STANDARD_BUDGET_WITH_TIME
}

export class Budget {
    id: string = '';
    is_archived: boolean = false 
    title: string = ''
    target: number = 0
    date_start: DateParser = DateParser.now()
    categories: Array<string> = []
    tags: Array<string> = []
    date_update: DateParser = DateParser.now()
    period: Period | null = null
    period_time: number = 0 
    date_end: DateParser|null = null
}

export interface IBudgetBuilder {
    reset(): void
    setId(id: string): void
    setTitle(title: string): void
    setTarget(target: number): void
    setIsArchived(is_archived: boolean): void
    setDateStart(date_start: DateParser): void
    setDateUpdate(date_update: DateParser): void
    setDateEnd(date_end: DateParser): void
    setPeriod(period: Period): void
    setPeriodTime(period_time: number): void
    setCategories(category: Array<string>): void
    setTags(tags: Array<Tag>): void
}

export class BudgetBuilder implements IBudgetBuilder {
    budget: Budget | null = null

    constructor() {
        this.budget = new Budget()
    }

    reset(): void {
        this.budget = null
    }
    setId(id: string): void {
        if (this.budget)
            this.budget.id = id 
    }
    setIsArchived(is_archived: boolean): void {
        if (this.budget)
            this.budget.is_archived = is_archived
    }
    setTitle(title: string): void {
        if (this.budget)
            this.budget.title = title
    }
    setTarget(target: number): void {
        if (this.budget)
            this.budget.target = target
    }
    setDateStart(date_start: DateParser): void {
        if (this.budget)
            this.budget.date_start = date_start
    }
    setDateUpdate(date_update: DateParser): void {
        if (this.budget)
            this.budget.date_update = date_update
    }
    setDateEnd(date_end: DateParser): void {
        if (this.budget)
            this.budget.date_end = date_end
    }
    setPeriod(period: Period): void {
        if (this.budget)
            this.budget.period = period
    }
    setPeriodTime(period_time: number): void {
        if (this.budget)
            this.budget.period_time = period_time
    }
    setCategories(categories: Array<string>): void {
        if (this.budget)
            this.budget.categories = categories
    }
    setTags(tags: Array<Tag>): void {
        if (this.budget)
            this.budget.tags = tags
    }
    
    getBudget(): Budget | null {
        let budget = this.budget
        this.reset()
        return budget
    }
}

export type CurrentDateBudget = {
    start_date: DateParser,
    end_date: DateParser
}

//Todo: Separeter value
export function determined_start_end_date(date: Date, period: Period, period_time: number): CurrentDateBudget {
    let start_date = null;
    let end_date = null;

    let today_year = date.getFullYear();
    let today_month = date.getMonth();
    let today_week_day = date.getDay();

    if (period === 'Year') {
        let year = today_year * period_time
        start_date = new Date(year, 0, 1);
        end_date = new Date(year, 31, 11);
    } 
    else if (period === "Month") {
        let month = today_month + (11 * (period_time - 1))
        start_date = new Date(today_year, month, 1);
        let last_day_of_month = new Date(today_year, today_month + 1, 0).getDate();
        end_date = new Date(today_year, month, last_day_of_month);
    }
    else if (period === "Week") {
        let day = (date.getDate() + (6 * (period_time - 1)))
        let monday_date = day - today_week_day + (today_week_day === 0 ? -6 : 0);
        let sunday_date = day - (6-today_week_day);
        start_date = new Date(today_year, today_month, monday_date);
        end_date = new Date(today_year, today_month, sunday_date);
    } 
    else {
        throw new ValidationError('There a error in field period');
    }

    return {
        start_date: new DateParser(start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()),
        end_date: new DateParser(end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate())
    };
}

export function determined_start_end_date_budget(period: Period, period_time: number): CurrentDateBudget {
    let today = new Date();
    return determined_start_end_date(today, period, period_time)
}

export function compute_current_spend(transactions: Transaction[]): number {
    let price_transacitons = transactions.map(trans => trans.record.price);
    let current_spend = price_transacitons.reduce((accumulator, current_value) => accumulator + current_value, 0);

    return current_spend;
}
