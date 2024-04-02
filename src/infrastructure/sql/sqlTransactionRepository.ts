import { Account } from "@/core/entities/account";
import { TransactionRepository, dbTransaction, dbTransactionPaginationResponse, dbFilter, dbSortBy } from "../../core/interactions/repositories/transactionRepository";
import { Transaction, Record } from "@/core/entities/transaction";
import { Category } from "@/core/entities/category";

export class SqlTransactionRepository implements TransactionRepository {
    private db: any;
    private table_name: string;
    private is_table_exist: boolean = false;
    private table_account_name: string = '';
    private table_category_name: string = '';
    private table_record_name: string = '';
    private table_tag_name: string = '';

    constructor(db: any, table_name: string) {
        this.db = db;
        this.table_name = table_name;
    }

    async create_table(table_account_name: string, table_category_name: string, table_tag_name: string, table_record_name: string): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name} (
                id TEXT PRIMARY KEY,
                id_account TEXT NOT NULL,
                id_category TEXT NOT NULL,
                id_record TEXT NOT NULL,
                FOREIGN KEY (id_account) REFERENCES ${table_account_name}(id),
                FOREIGN KEY (id_category) REFERENCES ${table_category_name}(title),
                FOREIGN KEY (id_record) REFERENCES ${table_record_name}(id)
            )
        `);

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name}_tags (
                id_transaction TEXT NOT NULL,
                id_tag TEXT NOT NULL,
                FOREIGN KEY (id_transaction) REFERENCES ${this.table_name}(id)
                    ON DELETE CASCADE
                FOREIGN KEY (id_tag) REFERENCES ${table_tag_name}(title)  
            )
        `);
        
        this.table_account_name = table_account_name;
        this.table_category_name = table_category_name;
        this.table_record_name = table_record_name;
        this.table_tag_name = table_tag_name;

        this.is_table_exist = true;
    }

    save(request: dbTransaction): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table transaction not created");
            }

            let result = await this.db.run(`
                INSERT INTO ${this.table_name} (id, id_account, id_category, id_record) VALUES (?, ?, ?, ?)`,
                request.id, request.account_ref, request.category_ref, request.record_ref,
            );

            let saved_tag = true;
            if (request.tag_ref.length > 0) {
                for (let tag of request.tag_ref) {
                    let result = await this.db.run(`
                        INSERT INTO ${this.table_name}_tags (id_transaction, id_tag) VALUES (?, ?)`,
                        request.id, tag
                    );
                    saved_tag = result != undefined;
                }
            }

            if (result != undefined && saved_tag) {
                resolve(true);
            } else {
                // TODO: Delete row when saving tags fault;
                resolve(false);
            } 
        });
    }
    get(id: string): Promise<Transaction | null> {
        return new Promise(async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table transaction not created");
            }
            
            
            let result = await this.db.get(`
                SELECT 
                    ${this.table_name}.id, 
                    ${this.table_account_name}.id as account_id,  ${this.table_account_name}.title as account_title, ${this.table_account_name}.credit_value, ${this.table_account_name}.credit_limit, 
                    ${this.table_record_name}.id  as record_id, ${this.table_record_name}.price, ${this.table_record_name}.date, ${this.table_record_name}.description, ${this.table_record_name}.type,
                    ${this.table_category_name}.title  as category_title, ${this.table_category_name}.icon
                FROM 
                    ${this.table_name} 
                JOIN ${this.table_account_name}
                    ON ${this.table_account_name}.id = ${this.table_name}.id_account
                JOIN ${this.table_record_name}
                    ON ${this.table_record_name}.id = ${this.table_name}.id_record
                JOIN ${this.table_category_name}
                    ON ${this.table_category_name}.title = ${this.table_name}.id_category
                WHERE ${this.table_name}.id = ?`,
                id
            );

            if(result != undefined) {
                let result_tag = await this.db.all(`
                    SELECT * 
                    FROM 
                        ${this.table_name}_tags
                    JOIN ${this.table_tag_name}
                        ON ${this.table_tag_name}.title = ${this.table_name}_tags.id_tag
                    WHERE ${this.table_name}_tags.id_transaction = ?
                    `,
                    id
                );

                let tags = []
                for (let tag of result_tag) {
                    tags.push(tag['title']);
                }

                let account: Account = {
                    id: result['account_id'],
                    title: result['account_title'],
                    credit_limit: result['credit_limit'],
                    credit_value: result['credit_value'],
                }

                let category: Category = {
                    title: result['category_title'],
                    icon: result['icon']
                }

                let record: Record = {
                    id: result['record_id'],
                    price: result['price'],
                    date: new Date(result['date']),
                    description: result['description'],
                    type: result['type']
                }

                resolve({
                    id: id,
                    account: account,
                    record: record,
                    category: category,
                    tags: tags
                });
            
            } else {
                resolve(null);
            }
        });
    }
    get_transactions_by_categories(category_ref: string[], start_date: Date, end_date: Date): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }
    get_transactions_by_tags(tags_ref: string[], start_date: Date, end_date: Date): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }
    get_paginations(page: number, size: number, sort_by: dbSortBy | null, filter_by: dbFilter): Promise<dbTransactionPaginationResponse> {
        throw new Error("Method not implemented.");
    }
    get_account_balance(id: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    update(request: dbTransaction): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }
}