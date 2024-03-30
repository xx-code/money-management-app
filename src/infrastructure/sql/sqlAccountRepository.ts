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
    async get(id: string): Promise<Account | null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`SELECT id, title, credit_value, credit_limit FROM ${this.table_account_name} WHERE id = ?`, id);

            console.log(result)

            if (result != undefined || result != null) {
                resolve({
                    id: result['id'],
                    title: result['title'],
                    credit_limit: result['credit_limit'],
                    credit_value: result['credit_value']
                });
            } else {
                resolve(null);
            }
        });
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