import { Account } from "@/core/entities/account";

export type dbAccount = {
    id: string;
    title: string;
    credit_value: number;
    credit_limit: number;
}


export interface AccountRepository {
    save(account: dbAccount): Promise<boolean>;
    exist(title: string): boolean;
    get(id: string): Promise<Account | null>;
    get_all(): Promise<Account[]>; 
    delete(id: string): Promise<boolean>;
    update(account: dbAccount): Promise<Account>;
}