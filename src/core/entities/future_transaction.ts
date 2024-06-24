import { Period } from "./budget";
import { Category } from "./category";
import DateParser from "./date_parser";
import { Tag } from "./tag";
import { Record } from './transaction';

export type FutureTransaction = {
    id: string;
    category: Category;
    tags: Tag[];
    record: Record;
    period: Period|null;
    period_time: number|null;
    date_end: DateParser;
}

export function period_is_undetermined(future_trans: FutureTransaction): boolean {
    return future_trans.period !== null && future_trans.period_time === null
}