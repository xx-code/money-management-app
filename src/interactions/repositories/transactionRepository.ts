import { Type } from "../../entities/transaction";

export type dbFilter = {
    categories: Array<string>;
    tags: Array<string>;
}

export type dbTransactionRequest = {
    id: string;
    account_ref: string;
    category_ref: string;
    tag_ref: string|null;
    type: Type;
    description: string;
    price: number;
    date: Date;
}

export type dbTransactionUpdateRequest = {
    id: string;
    category_ref: string|null;
    tag_ref: string|null;
    type: Type|null;
    description: string|null;
    price: number|null;
    date: Date|null;
}

export type dbTransactionResponse = {
    id: string;
    account_ref: string;
    category_ref: string;
    tag_ref: string|null;
    type: string;
    description: string;
    price: number;
    date: Date;
} 

export interface TransactionRepository {
    save(request: dbTransactionRequest): string;
    get(id: string): dbTransactionResponse|null;
    get_paginations(page:number, size: number, sort_by: string|null, filter_by: dbFilter): Array<dbTransactionResponse>;
    delete(id: string): boolean;
    update(request: dbTransactionUpdateRequest): dbTransactionResponse;
}