import { Account } from "@/core/entities/account";
import { AccountRepository, dbAccount } from "../../core/interactions/repositories/accountRepository";
import { open_database } from "../../config/sqlLiteConnection";

export class SqlAccountRepository implements AccountRepository {
    private db: any;
    public table_account_name: string;
    private create_table_query: string

    constructor(table_account_name: string) {
        this.table_account_name = table_account_name;
        this.create_table_query = `
            CREATE TABLE IF NOT EXISTS ${this.table_account_name} (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                is_saving INTEGER NOT NULL
            )
        `
    }

    async init(db_name: string): Promise<void> {
        this.db = await open_database(db_name)
        await this.db.exec(this.create_table_query);
        await this.updateTable()
    }

    async updateTable() {
        try {
            await this.db.exec(`Select id, title, is_saving from ${this.table_account_name} LIMIT 1`)
        } catch(err: any) {
            await this.db.exec(`ALTER TABLE ${this.table_account_name} RENAME TO ${this.table_account_name}_old`)
            
            await this.db.exec(this.create_table_query);

            let results = await this.db.all(`SELECT * FROM ${this.table_account_name}_old`);
            for(let result of results) {
                await this.db.run(`
                INSERT INTO ${this.table_account_name} (id, title, is_saving) VALUES (?, ?, ?)`,
                result['id'], result['title'], result['is_saving']
            );
            await this.db.exec(`DELETE FROM ${this.table_account_name}_old`)
            }
        } 
    }

    async save(account: dbAccount): Promise<boolean> {
        return new Promise( async (resolve, reject) => {    
            let result = await this.db.run(`
                INSERT INTO ${this.table_account_name} (id, title, is_saving) VALUES (?, ?, ?)`,
                account.id, account.title, account.is_saving
            );

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    }
    async exist(account_title: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`SELECT id, title, is_saving FROM ${this.table_account_name} WHERE title = ?`, account_title);

            if (result != undefined) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
    async get(id: string): Promise<Account | null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`SELECT id, title, is_saving FROM ${this.table_account_name} WHERE id = ?`, id);

            if (result != undefined) {
                resolve({
                    id: result['id'],
                    title: result['title'],
                    is_saving: result['is_saving']
                });
            } else {
                resolve(null);
            }
        });
    }
    get_all(): Promise<Account[]> {
        return new Promise(async (resolve, reject) => {
            let results = await this.db.all(`SELECT id, title, is_saving FROM ${this.table_account_name}`);
            let all_accounts: Account[] = [];

            for (let result of results) {
                all_accounts.push({
                    id: result['id'],
                    title: result['title'],
                    is_saving: result['is_saving']
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
                UPDATE ${this.table_account_name} SET title = ?, is_saving = ? WHERE id = ? 
            `, account.title, account.is_saving, account.id);

            let account_updated = await this.get(account.id);

            resolve(account_updated!);
        });
    }
}