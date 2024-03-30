import { Account } from "./account";
import { Category } from "./category";
import { Tag } from "./tag";

export type TransactionType ='Debit' | 'Credit';

export type Record = {
    id: string;
    price: number;
    date: Date;
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