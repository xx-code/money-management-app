import { Account } from "@/core/entities/account";
import { AccountRepository, dbAccount } from "../../core/interactions/repositories/accountRepository";
import { TransactionRepository } from "../../core/interactions/repositories/transactionRepository";

export class InMemoryAccountRepository implements AccountRepository {
    private db: Map<string, Account> = new Map();

    exist(title: string): boolean {
        let accounts = Array.from(this.db.values());
        let accounts_filtered = accounts.filter((account) => account.title == title);
        
        return accounts_filtered.length > 0;
    }

    get(id: string): Account | null {
        let account = this.db.get(id); 
        if (account == undefined) {
            return null;
        }

        return {
            id: account.id,
            title: account.title,
            credit_limit: account.credit_limit,
            credit_value: account.credit_value
        };
    }

    get_all(): Account[] {
        let accounts = [];
        for(let [id, account] of this.db.entries()) {
            accounts.push({
                id: id,
                title: account.title,
                credit_limit: account.credit_limit,
                credit_value: account.credit_value
            });
        };

        return accounts;
    }

    save(account: Account): string {
        this.db.set(account.id, account);

        return account.id;
    }

    delete(id: string): boolean {
        return this.db.delete(id);
    }

    updated(account: Account): Account {
        let account_update = this.db.get(account.id);
        
        if (account.credit_limit != null) {
            account_update!.credit_limit = account.credit_limit;
        }

        if (account.credit_value != null) {
            account_update!.credit_value = account.credit_value;
        }

        if (account.title != null) {
            account_update!.title = account.title;   
        }

        this.db = this.db.set(account.id, account_update!);

        return {
            id: account_update!.id,
            title: account_update!.title,
            credit_limit: account_update!.credit_limit,
            credit_value: account_update!.credit_value
        };
    }
}