import { Account } from "@/core/entities/account";
import { TransactionRepository, dbTransaction, dbTransactionPaginationResponse, dbFilter, dbSortBy } from "../../core/interactions/repositories/transactionRepository";
import { Transaction } from "@/core/entities/transaction";

export class SqlTransactionRepository implements TransactionRepository {
    private db: any;
    private table_name: string;
    private is_table_exist: boolean = false;

    constructor(db: any, table_name: string) {
        this.db = db;
        this.table_name = table_name;
    }

    async create_table(table_account_name: string, table_category_name: string, table_tag_name: string, table_record_name: string): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name} (
                id TEXT PRIMARY KEY,
                id_account TEXT NOT NULL,
                id_tag_list TEXT,
                id_category TEXT NOT NULL,
                id_record TEXT NOT NULL,
                FOREIGN KEY (id_account) REFERENCES ${table_account_name},
                FOREIGN KEY (id_category) REFERENCES ${table_category_name},
                FOREIGN KEY (id_record) REFERENCES ${table_record_name},
                FOREIGN KEY (id_tag_list) REFERENCES ${this.table_name}_tags
            )
        `);

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name}_tags (
                id_transaction TEXT NOT NULL,
                id_tag TEXT NOT NULL,
                FOREIGN KEY (id_transaction) REFERENCES ${this.table_name},
                FOREIGN KEY (id_tag) REFERENCES ${table_tag_name}
            )
        `);

        this.is_table_exist = true;
    }

    save(request: dbTransaction): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table transaction not created");
            }

            let result = await this.db.run(`
                INSERT INTO ${this.table_name} (id, id_account, id_tag_list, id_category, id_record) VALUES (?, ?, ?, ?, ?)`,
                request.id, request.account_ref, null, request.category_ref, request.record_ref,
            );

            if (request.tag_ref.length > 0) {
                for (let tag in request.tag_ref) {
                    await this.db.run(`
                        INSERT INTO ${this.table_name}_tags (id_transaction, id_tag) VALUES (?, ?)`,
                        request.id, tag
                    );
                }
            }

            if (result != undefined ) {
                resolve(true);
            } else {
                resolve(false);
            } 
        });
    }
    get(id: string): Promise<Transaction | null> {
        throw new Error("Method not implemented.");
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