import { Account } from "../domains/entities/account";

export interface AccountRepository {
    save(account: Account): Promise<boolean>;
    exist(account_title: string): Promise<boolean>;
    get(id: string): Promise<Account | null>;
    get_all(): Promise<Account[]>; 
    delete(id: string): Promise<boolean>;
    update(account: Account): Promise<Account>;
}