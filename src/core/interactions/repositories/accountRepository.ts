import { Account } from "@/core/entities/account";

export type dbAccount = {
    id: string;
    title: string;
    is_saving: boolean
}


export interface AccountRepository {
    save(account: dbAccount): Promise<boolean>;
    exist(account_title: string): Promise<boolean>;
    get(id: string): Promise<Account | null>;
    get_all(): Promise<Account[]>; 
    delete(id: string): Promise<boolean>;
    update(account: dbAccount): Promise<Account>;
}