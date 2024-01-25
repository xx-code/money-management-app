export type dbAccount = {
    id: string;
    title: string;
    credit_value: number;
    credit_limit: number;
}

export type dbAccountUpdate = {
    id: string;
    title: string | null;
    credit_value: number | null;
    credit_limit: number | null;
}

export type dbAccountResponse = {
    id: string;
    title: string;
    credit_value: number;
    credit_limit: number;
    balance: number;
}

export interface AccountRepository {
    save(account: dbAccount): string;
    exist(title: string): boolean;
    get(id: string): dbAccountResponse | null;
    get_all(): Array<dbAccountResponse>; 
    delete(id: string): boolean;
    updated(account: dbAccountUpdate): dbAccountResponse;
}