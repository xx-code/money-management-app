import { Account } from "@/core/entities/account";
import { AccountRepository, dbAccount } from "../../core/interactions/repositories/accountRepository";

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

    async save(account: dbAccount): Promise<boolean> {
        return new Promise( async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table account not created");
            }
    
            let result = await this.db.run(`
                INSERT INTO ${this.table_account_name} (id, title, credit_value, credit_limit) VALUES (?, ?, ?, ?)`,
                account.id, account.title, account.credit_value, account.credit_limit
            );

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    }
    exist(title: string): boolean {
        throw new Error("Method not implemented.");
    }
    async get(id: string): Promise<Account | null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`SELECT id, title, credit_value, credit_limit FROM ${this.table_account_name} WHERE id = ?`, id);

            if (result != undefined) {
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
    get_all(): Promise<Account[]> {
        return new Promise(async (resolve, reject) => {
            let results = await this.db.all(`SELECT id, title, credit_value, credit_limit FROM ${this.table_account_name}`);
            let all_accounts: Account[] = [];

            for (let result of results) {
                all_accounts.push({
                    id: result['id'],
                    title: result['title'],
                    credit_limit: result['credit_limit'],
                    credit_value: result['credit_value']
                })
            } 
            
            resolve(all_accounts);
        });
    }
    async delete(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`DELETE FROM ${this.table_account_name} WHERE id = ?`, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        });
    }
    async update(account: dbAccount): Promise<Account> {
        return new Promise(async (resolve, reject) => {
            await this.db.run(`
                UPDATE ${this.table_account_name} SET title = ?, credit_value = ?, credit_limit = ? WHERE id = ? 
            `, account.title, account.credit_value, account.credit_limit, account.id);

            let account_updated = await this.get(account.id);

            resolve(account_updated!);
        });
    }
}