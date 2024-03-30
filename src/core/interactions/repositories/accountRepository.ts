import { Account } from "@/core/entities/account";

export type dbAccount = {
    id: string;
    title: string;
    credit_value: number;
    credit_limit: number;
}


export interface AccountRepository {
    save(account: dbAccount): string;
    exist(title: string): boolean;
    get(id: string): Account | null;
    get_all(): Array<Account>; 
    delete(id: string): boolean;
    updated(account: dbAccount): Account;
}