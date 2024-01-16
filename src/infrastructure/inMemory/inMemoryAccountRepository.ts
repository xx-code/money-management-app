import { AccountRepository, dbAccount, dbAccountResponse, dbAccountUpdate } from "../../interactions/repositories/accountRepository";
import { TransactionRepository } from "../../interactions/repositories/transactionRepository";

export class InMemoryAccountRepository implements AccountRepository {
    private db: Map<string, dbAccount> = new Map();
    /*private transaction_repository: TransactionRepository;

    constructor(transaction_repository: TransactionRepository) {
        this.transaction_repository = transaction_repository;
    }*/

    exist(title: string): boolean {
        let accounts = Array.from(this.db.values());
        let accounts_filtered = accounts.filter((account) => account.title == title);
        
        return accounts_filtered.length > 0;
    }

    get(id: string): dbAccountResponse | null {
        let account = this.db.get(id); 
        if (account == undefined) {
            return null;
        }

        return {
            id: account.id,
            title: account.title,
            credit_limit: account.credit_limit,
            credit_value: account.credit_value,
            balance: this.get_balance(account.id)
        };
    }

    get_all(): dbAccountResponse[] {
        let accounts = [];
        for(let [id, account] of this.db.entries()) {
            accounts.push({
                id: id,
                title: account.title,
                credit_limit: account.credit_limit,
                credit_value: account.credit_value,
                balance: this.get_balance(id)
            });
        };

        return accounts;
    }

    save(account: dbAccount): string {
        this.db.set(account.id, account);

        return account.id;
    }

    delete(id: string): boolean {
        return this.db.delete(id);
    }

    updated(account: dbAccountUpdate): dbAccountResponse {
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

        this.db = this.db.set(account.id, account_update!)

        return {
            id: account_update!.id,
            title: account_update!.title,
            credit_limit: account_update!.credit_limit,
            credit_value: account_update!.credit_value,
            balance: this.get_balance(account_update!.id)
        };
    }

    private get_balance(account_ref: string): number {
        return 0;
    }
}