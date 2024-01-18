export type dbFilter = {
    accounts: Array<string>;
    categories: Array<string>;
    tags: Array<string>;
}

export type dbTransaction = {
    id: string;
    account_ref: string;
    category_ref: string;
    tag_ref: string|null;
    type: string;
    description: string;
    price: number;
    date: Date;
}

export type dbTransactionUpdateRequest = {
    id: string;
    category_ref: string|null;
    tag_ref: string|null;
    type: string|null;
    description: string|null;
    price: number|null;
    date: Date|null;
}

export type dbTransactionResponse = {
    id: string;
    account_ref: string;
    category_title: string;
    category_icon: string;
    tag: string|null;
    type: string;
    description: string;
    price: number;
    date: Date;
} 

export type dbTransactionPaginationResponse = {
    transactions: dbTransactionResponse[];
    current_page: number;
    max_page: number;
}

export interface TransactionRepository {
    save(request: dbTransaction): string;
    get(id: string): dbTransactionResponse|null;
    get_paginations(page:number, size: number, sort_by: string|null, filter_by: dbFilter): dbTransactionPaginationResponse;
    get_balance(filter_by: dbFilter): number;
    delete(id: string): boolean;
    update(request: dbTransactionUpdateRequest): dbTransactionResponse;
}