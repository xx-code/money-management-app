import { ValidationError } from "../errors/validationError";
import { Category } from "./category";
import DateParser from "./date_parser";
import { Tag } from "./tag";
import { Transaction } from "./transaction";

export type Period = 'Week' | 'Month' | 'Year';

type Budget = {
    id: string;
    title: string;
    target: number;
}

export type BudgetWithCategory = Budget & {
    period: Period;
    period_time: number;
    categories: Array<Category>
}

export type BudgetWithTag = Budget & {
    date_start: DateParser;
    date_end: DateParser;
    tags: Array<Tag>;
}

export type BudgetWithCategoryDisplay = Budget & {
    current: number;
    period: string;
    period_time: number;
    categories: Array<Category>
}

export type BudgetWithTagDisplay = Budget & {
    current: number;
    date_start: DateParser;
    date_end: DateParser;
    tags: Array<Tag>;
}

export type CurrentDateBudget = {
    start_date: DateParser,
    end_date: DateParser
}

export function determined_start_end_date_budget(budget: BudgetWithCategory): CurrentDateBudget {
    let start_date = null;
    let end_date = null;

    let today = new Date();
    let today_year = today.getFullYear();
    let today_month = today.getMonth();
    let today_week_day = today.getDay();

    if (budget.period == 'Year') {
        let year = today_year * budget.period_time
        start_date = new Date(year, 0, 1);
        end_date = new Date(year, 31, 11);
    } else if (budget.period == 'Month') {
        let month = today_month + (11 * (budget.period_time - 1))
        start_date = new Date(today_year, month, 1);
        let last_day_of_month = new Date(today_year, today_month + 1, 0).getDate();
        end_date = new Date(today_year, month, last_day_of_month);
    } else if (budget.period == 'Week' ) {
        let day = (today.getDate() + (6 * (budget.period_time - 1)))
        let monday_date = day - today_week_day + (today_week_day === 0 ? -6 : 0);
        let sunday_date = day - (6-today_week_day);
        start_date = new Date(today_year, today_month, monday_date);
        end_date = new Date(today_year, today_month, sunday_date);
    } else {
        throw new ValidationError('There a error in field period of budget');
    }

    return {
        start_date: new DateParser(start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()),
        end_date: new DateParser(end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate())
    };
}

export function compute_current_spend(transactions: Transaction[]): number {
    let price_transacitons = transactions.map(trans => trans.record.price);
    let current_spend = price_transacitons.reduce((accumulator, current_value) => accumulator + current_value, 0);

    return current_spend;
}
