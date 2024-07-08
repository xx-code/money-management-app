import { ValidationError } from "../errors/validationError";
import { Account } from "./account";
import { Period } from "./budget";
import { Category } from "./category";
import DateParser from "./date_parser";
import { Tag } from "./tag";
import { Record } from './transaction';

export type FutureTransaction = {
    id: string;
    is_archived: boolean;
    account: Account;
    category: Category;
    record: Record;
    period: Period;
    tags: Tag[];
    period_time: number;
    repeat: number|null;
    date_start: DateParser;
    date_update: DateParser;
    date_end: DateParser | null;
}


//Todo: Separeter value
export function determined_end_date_with(date: Date, period: Period, period_time: number, repeat: number = 1): DateParser {
    let end_date = new Date(date);


    let period_repeat = (period_time * repeat)

    if (period === 'Year') {
        end_date.setFullYear(end_date.getFullYear() + period_repeat)
    } 
    else if (period === "Month") {
        end_date.setMonth(end_date.getMonth() + period_repeat)
    }
    else if (period === "Week") {
        end_date.setDate(end_date.getDate() + (7 * period_repeat))
    } 
    else if (period === "Day") {
        end_date.setDate(end_date.getDate() + period_repeat)
    } else {
        throw new ValidationError('There a error in field period');
    }

    return new DateParser(end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate());
}