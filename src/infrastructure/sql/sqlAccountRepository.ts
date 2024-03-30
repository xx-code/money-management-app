import { Account } from "@/core/entities/account";
import { AccountRepository, dbAccount } from "../../core/interactions/repositories/accountRepository";
import { Database } from "sqlite3";

export class SqlAccountRepository implements AccountRepository {
    private db: any;
    private table_account_name: string;
    private is_table_exist: boolean = false;

    constructor(db: any, table_account_name: string) {
        this.db = db;
        this.table_account_name = table_account_name;
    }

    async create_table(): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_account_name} (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                credit_value INTEGER NOT NULL,
                credit_limit INTEGER NOT NULL
            )
        `);
        this.is_table_exist = true;
    }

    async save(account: dbAccount): Promise<string> {
        return new Promise( async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table account not created");
            }
    
            let _ = await this.db.run(`
                INSERT INTO ${this.table_account_name} (id, title, credit_value, credit_limit) VALUES (?, ?, ?, ?)`,
                account.id, account.title, account.credit_value, account.credit_limit
            );


            resolve(account.id);
        })
    }
    exist(title: string): boolean {
        throw new Error("Method not implemented.");
    }
    get(id: string): Account | null {
        throw new Error("Method not implemented.");
    }
    get_all(): Account[] {
        throw new Error("Method not implemented.");
    }
    delete(id: string): boolean {
        throw new Error("Method not implemented.");
    }
    updated(account: dbAccount): Account {
        throw new Error("Method not implemented.");
    }
}