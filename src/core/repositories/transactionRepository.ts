import { TransactionPaginationResponse } from "../domains/metaData/transaction";
import { Transaction, TransactionType } from "../domains/entities/transaction";

export type TransactionFilter = {
    accounts: Array<string>;
    categories: Array<string>;
    tags: Array<string>;
    start_date: string | null | undefined;
    end_date: string | null | undefined;
    price: number | null | undefined;
    type: TransactionType | null | undefined;
}

export type SortBy = {
    sort_by: string,
    asc: boolean
}


export interface TransactionRepository {
    save(request: Transaction): Promise<boolean>;
    get(id: string): Promise<Transaction|null>;
    getPaginations(page:number, size: number, sort_by: SortBy|null, filter_by: TransactionFilter): Promise<TransactionPaginationResponse>;
    getAccountBalance(id: string): Promise<number>;
    getBalance(filter_by: TransactionFilter): Promise<number>;
    delete(id: string): Promise<boolean>;
    update(request: Transaction): Promise<boolean>;
}