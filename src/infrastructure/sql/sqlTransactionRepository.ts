import { Account } from "@/core/entities/account";
import { TransactionRepository, dbTransaction, dbTransactionPaginationResponse, dbFilter, dbSortBy } from "../../core/interactions/repositories/transactionRepository";
import { Transaction, Record } from "@/core/entities/transaction";
import { Category } from "@/core/entities/category";
import { Tag } from "@/core/entities/tag";
import { Waiting_for_the_Sunrise } from "next/font/google";

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


    private async get_all_tags(id_transaction: string): Promise<Tag[]> {
        return new Promise(async (resolve, reject) => {
            let result_tag = await this.db.all(`
                SELECT * 
                FROM 
                    ${this.table_name}_tags
                JOIN ${this.table_tag_name}
                    ON ${this.table_tag_name}.title = ${this.table_name}_tags.id_tag
                WHERE ${this.table_name}_tags.id_transaction = ?
                `,
                id_transaction
            );

            let tags = []
            for (let tag of result_tag) {
                tags.push(tag['title']);
            }

            resolve(tags);
        });
    }

    private create_transaction(id:string, result_db: any, tags: Tag[]): Transaction {
        let account: Account = {
            id: result_db['account_id'],
            title: result_db['account_title'],
            credit_limit: result_db['credit_limit'],
            credit_value: result_db['credit_value'],
        }

        let category: Category = {
            title: result_db['category_title'],
            icon: result_db['icon']
        }

        let record: Record = {
            id: result_db['record_id'],
            price: result_db['price'],
            date: new Date(result_db['date']),
            description: result_db['description'],
            type: result_db['type']
        } 
        
        return {
            id: id,
            account: account,
            record: record,
            category: category,
            tags: tags
        }
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
                let tags = await this.get_all_tags(id);

                let transaction = this.create_transaction(id, result, tags);

                resolve(transaction);
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
        return new Promise(async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table transaction not created");
            }

            let count = await this.db.get(`SELECT COUNT(*) FROM ${this.table_name}`);

            let max_page = Math.ceil(count['COUNT(*)']/size);
            
            let index_start_element_in_page = (page - 1) * size;

            let filter_id_account: string[] = [];
            for (let account of filter_by.accounts) {
                filter_id_account.push(account.id);
            }

            let where_id_account = `account_id in (${filter_id_account})`;

            let filter_id_cat: string[] = [];
            for (let category of filter_by.categories) {
                filter_id_cat.push(`'${category.title}'`);
            }

            let where_id_catogry = `category_title in (${filter_id_cat})`;

            let filter_id_tag: string[] = [];
            for (let tag of filter_by.tags) {
                filter_id_tag.push(tag);
            }

            let result_filter_by_tag = await this.db.all(`
                SELECT id_transaction
                FROM 
                    ${this.table_name}_tags
                JOIN ${this.table_tag_name}
                    ON ${this.table_tag_name}.title = ${this.table_name}_tags.id_tag
                WHERE ${this.table_name}_tags.id_tag in (?)
                `,
                filter_id_tag.toString()
            ); 

            let filter_id_transaction_tag: string[] = [];
            for(let result of result_filter_by_tag) {
                filter_id_transaction_tag.push(result['id_transaction']);
            }
            let where_id_transaction_tag = `${this.table_name}.id in (${filter_id_transaction_tag})`;

            let where = '';
            let value_where = [];
            
            if (filter_id_transaction_tag.length > 0) {
                value_where.push(where_id_transaction_tag);
            }

            if (filter_id_account.length > 0) {
                value_where.push(where_id_account);
            }

            if (filter_id_cat.length > 0) {
                value_where.push(where_id_catogry);
            }

            if (value_where.length > 0) {
                where = 'WHERE ' + value_where.toString().replaceAll(',', ' AND ');
            }

            let results = await this.db.all(`
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
                ${where}
                LIMIT ${size} OFFSET ${index_start_element_in_page}
                `
            );


            let transactions = [];

            for (let result of results) {
                let id_transaction = result['id'];
                let tags = await this.get_all_tags(id_transaction);
                let transaction = this.create_transaction(id_transaction, result, tags);

                transactions.push(transaction);
            }

            resolve({
                current_page: page,
                max_page: max_page,
                transactions: transactions
            });
        });
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