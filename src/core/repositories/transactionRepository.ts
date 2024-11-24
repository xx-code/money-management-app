import { TransactionPaginationResponse } from "../domains/metaData/transaction";
import { DateParser } from "../domains/helpers";
import { Transaction, TransactionType } from "../domains/entities/transaction";

export type TransactionFilter = {
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


export interface TransactionRepository {
    save(request: Transaction): Promise<boolean>;
    get(id: string): Promise<Transaction|null>;
    get_paginations(page:number, size: number, sort_by: dbSortBy|null, filter_by: TransactionFilter): Promise<TransactionPaginationResponse>;
    get_account_balance(id: string): Promise<number>;
    get_balance(filter_by: TransactionFilter): Promise<number>;
    delete(id: string): Promise<boolean>;
    update(request: dbTransaction): Promise<Transaction>;
}