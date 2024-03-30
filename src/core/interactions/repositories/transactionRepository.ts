import { Account } from "@/core/entities/account";
import { Category } from "@/core/entities/category";
import { Tag } from "@/core/entities/tag";
import { Transaction } from "@/core/entities/transaction";

export type dbFilter = {
    accounts: Array<Account>;
    categories: Array<Category>;
    tags: Array<Tag>;
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
    save(request: dbTransaction): string;
    get(id: string): Transaction|null;
    get_transactions_by_categories(category_ref: string[], start_date: Date, end_date: Date): Transaction[];
    get_transactions_by_tags(tags_ref: string[], start_date: Date, end_date: Date): Transaction[];
    get_paginations(page:number, size: number, sort_by: dbSortBy|null, filter_by: dbFilter): dbTransactionPaginationResponse;
    get_account_balance(id: string): number;
    delete(id: string): boolean;
    update(request: dbTransaction): Transaction;
}