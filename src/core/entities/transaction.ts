import { Account } from "./account";
import { Category } from "./category";
import DateParser from "./date_parser";
import { Tag } from "./tag";

export enum TransactionType {
    Debit = 'Debit',
    Credit = 'Credit'
}

export function is_Transaction_type(value: string): value is TransactionType {
    return value in TransactionType;
}

export type Record = {
    id: string;
    price: number;
    date: DateParser;
    description: string;
    type: TransactionType
}

export type Transaction = {
    id: string;
    account: Account;
    tags: Tag[];
    category: Category;
    record: Record
}