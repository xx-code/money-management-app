import DateParser from "@/core/entities/date_parser";
import { Transaction, TransactionType } from "@/core/entities/transaction";

export type dbFilter = {
    accounts: Array<string>;
    categories: Array<string>;
    tags: Array<string>;
    start_date: DateParser | null | undefined;
    end_date: DateParser | null | undefined;
    price: number | null | undefined;
    type: TransactionType | null | undefined;
}

export type dbSortBy = {
    sort_by: string,
    asc: boolean
}

export type dbTransaction = {
    id: string;
    account_ref: string;
    category_ref: string;
    tag_ref: string[];
    record_ref: string;
}


export type dbTransactionPaginationResponse = {
    transactions: Transaction[];
    current_page: number;
    max_page: number;
}

export interface TransactionRepository {
    save(request: dbTransaction): Promise<boolean>;
    get(id: string): Promise<Transaction|null>;
    get_transactions_by_categories(category_ref: string[], start_date: DateParser, end_date: DateParser): Promise<Transaction[]>;
    get_transactions_by_tags(tags_ref: string[], start_date: DateParser, end_date: DateParser): Promise<Transaction[]>;
    get_paginations(page:number, size: number, sort_by: dbSortBy|null, filter_by: dbFilter): Promise<dbTransactionPaginationResponse>;
    get_account_balance(id: string): Promise<number>;
    get_balance(filter_by: dbFilter): Promise<number>;
    delete(id: string): Promise<boolean>;
    update(request: dbTransaction): Promise<Transaction>;
}