import { ValidationError } from "../errors/validationError";
import { Category } from "./category";
import DateParser from "./date_parser";
import { Tag } from "./tag";
import { Transaction } from "./transaction";

export type Period =  'Day' | 'Week' | 'Month' | 'Year' ;

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

export class Budget {
    id: string = '';
    is_archived: boolean = false 
    title: string = ''
    target: number = 0
    current: number = 0
    date_start: DateParser = DateParser.now()
    categories: Array<Category> = []
    tags: Array<Tag> = []
    date_update: DateParser = DateParser.now()
    period: Period = "Day"
    period_time: number = 0
    date_end: DateParser = DateParser.now()

}

interface IBudgetBuilder {
    reset(): void
    setId(id: string): void 
    setIsArchived(archived: boolean): void
    setTitle(title: string): void
    setStartDate(start_date: DateParser): void
    setUpdateDate(update_date: DateParser): void
    setEndDate(end_date: DateParser): void
    setPeriod(period: Period): void
    setPeriodTime(period_time: number): void
    setCategories(categories: Array<Category>): void
    setTags(tags: Array<Tag>): void
    setTarget(price: number): void 
}

class BudgetBuilder implements IBudgetBuilder {
    private budget: Budget | null = null

    constructor() {
        this.reset()
    }

    reset(): void {
        this.budget = new Budget()
    }
    setId(id: string): void {
        this.budget!.id = id
    }
    setIsArchived(archived: boolean): void {
        this.budget!.is_archived = archived
    }
    setTitle(title: string): void {
        this.budget!.title = title
    }
    setStartDate(start_date: DateParser): void {
        this.budget!.date_start = start_date
    }
    setUpdateDate(update_date: DateParser): void {
        this.budget!.date_end = update_date
    }
    setEndDate(end_date: DateParser): void {
        this.budget!.date_end = end_date
    }
    setPeriod(period: Period): void {
        this.budget!.period = period
    }
    setPeriodTime(period_time: number): void {
        this.budget!.period_time = period_time
    }
    setCategories(categories: Array<Category>): void {
        this.budget!.categories = categories
    }
    setTags(tags: Array<Tag>): void {
        this.budget!.tags = tags
    }
    setTarget(price: number): void {
        this.budget!.target = price
    } 
}


export type BudgetDisplay = {
    id: string;
    is_periodic: boolean
    title: string;
    target: number;
    date_start: DateParser;
    date_to_update: DateParser|null
    date_end: DateParser | null;
    period: Period | null
    period_time: number | null
    categories: Array<Category>
    tags: Array<Tag>
    current: number;
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
