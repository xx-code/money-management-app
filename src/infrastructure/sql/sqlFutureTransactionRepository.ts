import { FutureTransactionRepository, dbFutureTransaction } from "@/core/interactions/repositories/futureTransactionRepository";
import { open_database } from "../../config/sqlLiteConnection";
import { FutureTransaction } from "../../core/entities/future_transaction";
import { Tag } from "../../core/entities/tag";
import DateParser from "../../core/entities/date_parser";
import { Category } from "../../core/entities/category";
import { Record } from '../../core/entities/transaction';
import { Account } from "../../core/entities/account";

export class SqlFutureTransactionRepository implements FutureTransactionRepository {
    private db: any;
    public table_name: string;
    private table_account_name: string = '';
    private table_category_name: string = '';
    private table_record_name: string = '';
    private table_tag_name: string = '';

    constructor(table_name: string) {
        this.table_name = table_name;
    }

    async init(db_file_name: string, table_account_name: string, table_category_name: string, table_tag_name: string, table_record_name: string): Promise<void> {
        this.db = await open_database(db_file_name);
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name} (
                id TEXT PRIMARY KEY,
                id_account TEXT NOT NULL,
                id_category TEXT NOT NULL,
                id_record TEXT NOT NULL,
                is_archived INTEGER TEXT NOT NULL,
                period TEXT NOT NULL,
                period_time INTEGER NOT NULL,
                repeat INTERGER,
                date_start TEXT NOT NULL,
                date_update TEXT NOT NULL,
                date_end TEXT,
                FOREIGN KEY (id_account) REFERENCES ${table_account_name}(id),
                FOREIGN KEY (id_category) REFERENCES ${table_category_name}(id),
                FOREIGN KEY (id_record) REFERENCES ${table_record_name}(id)
                    ON DELETE CASCADE
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

            let tags: Tag[] = []
            for (let tag of result_tag) {
                tags.push(tag['title']);
            }

            resolve(tags);
        });
    }

    private create_transaction(id:string, result_db: any, tags: Tag[]): FutureTransaction {
        let account: Account = {
            id: result_db['account_id'],
            title: result_db['account_title'],
            is_saving: result_db['is_saving']
        }

        let category: Category = {
            id: result_db['id'],
            title: result_db['category_title'],
            icon: result_db['icon']
        }

        let record: Record = {
            id: result_db['record_id'],
            price: result_db['price'],
            date: DateParser.from_string(result_db['record_date']),
            description: result_db['description'],
            type: result_db['type']
        } 

        let date_end = null;
        if (result_db['date_end'] !== null && result_db['date_end'] !== undefined) {
            date_end = DateParser.from_string(result_db['date_end'] )
        }

        let future_transact: FutureTransaction = {
            id: id,
            is_archived: result_db['is_archived'],
            account: account,
            record: record,
            category: category,
            period: result_db['period'],
            period_time: result_db['period_time'],
            repeat: result_db['repeat'],
            date_start: DateParser.from_string(result_db['date_start']),
            date_update: DateParser.from_string(result_db['date_update']),
            date_end: date_end,
            tags: tags
        }
        
        return future_transact
    }

    save(request: dbFutureTransaction): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let date_end: string | null = request.date_end !== null ? request.date_end.toString() : null;
            let result = await this.db.run(`
                INSERT INTO ${this.table_name} (
                    id, 
                    id_account, 
                    id_category, 
                    id_record,
                    is_archived,
                    period,
                    period_time,
                    repeat,
                    date_start,
                    date_update,
                    date_end) VALUES (?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ?)`,
                request.id, 
                request.account_ref, 
                request.category_ref, 
                request.record_ref, 

                request.is_archived, request.period, request.period_time, request.repeat, request.date_start.toString(), request.date_update.toString(), date_end
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
                resolve(request.id);
            } else {
                // TODO: Delete row when saving tags fault;
                resolve('');
            } 
        });
    }
    update(request: dbFutureTransaction): Promise<FutureTransaction> {
        return new Promise(async (resolve, reject) => {
            let date_end: string | null = request.date_end !== null ? request.date_end.toString() : null;
            await this.db.run(`
                UPDATE ${this.table_name} SET id_account = ?, id_category = ?, period = ?, period_time = ?, repeat = ?, date_start = ?, date_update = ?, date_end = ? WHERE id = ? 
            `, request.account_ref, request.category_ref, request.period, request.period_time, request.repeat, request.date_start.toString(), request.date_update.toString(), date_end,  request.id);

            let result_filter_by_tag = await this.db.all(`
                SELECT id_transaction, id_tag
                FROM 
                    ${this.table_name}_tags
                JOIN ${this.table_tag_name}
                    ON ${this.table_tag_name}.title = ${this.table_name}_tags.id_tag
                WHERE id_transaction = ?
                `,
                request.id
            ); 

            let tag_to_remove = [];
            let tag_to_add = [];

            let tags = [];
            for(let result of result_filter_by_tag) {
                if (!request.tag_ref.includes(result['id_tag'])) {
                    tag_to_remove.push(result['id_tag']);
                }
                tags.push(result['id_tag']);
            }

            for (let tag of request.tag_ref) {
                if (!tags.includes(tag)) {
                    tag_to_add.push(tag);
                }
            }

            if (tag_to_remove.length > 0) {
                await this.db.run(`DELETE FROM ${this.table_name}_tags WHERE id_tag in (?)`, tag_to_remove.toString());
            }

            if (tag_to_add.length > 0) {
                for (let tag of tag_to_add) {
                    await this.db.run(`
                        INSERT INTO ${this.table_name}_tags (id_transaction, id_tag) VALUES (?, ?)`,
                        request.id, tag
                    );
                }
            }

            let transaction = await this.get(request.id);

            resolve(transaction!);
        });
    }
    get(id: string): Promise<FutureTransaction | null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`
                SELECT 
                    ${this.table_name}.id, ${this.table_name}.is_archived, ${this.table_name}.period, ${this.table_name}.period_time, ${this.table_name}.repeat, ${this.table_name}.date_start, ${this.table_name}.date_update, ${this.table_name}.date_end,
                    ${this.table_account_name}.id as account_id,  ${this.table_account_name}.title as account_title, ${this.table_account_name}.is_saving, 
                    ${this.table_record_name}.id  as record_id, ${this.table_record_name}.price, ${this.table_record_name}.date as record_date, ${this.table_record_name}.description, ${this.table_record_name}.type,
                    ${this.table_category_name}.title as category_title, ${this.table_category_name}.icon
                FROM 
                    ${this.table_name} 
                JOIN ${this.table_account_name}
                    ON ${this.table_account_name}.id = ${this.table_name}.id_account
                JOIN ${this.table_record_name}
                    ON ${this.table_record_name}.id = ${this.table_name}.id_record
                JOIN ${this.table_category_name}
                    ON ${this.table_category_name}.id = ${this.table_name}.id_category
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
    get_all(): Promise<FutureTransaction[]> {
        return new Promise(async (resolve, reject) => {
            let results = await this.db.all(`
                SELECT 
                    ${this.table_name}.id, ${this.table_name}.is_archived, ${this.table_name}.period, ${this.table_name}.period_time, ${this.table_name}.repeat, ${this.table_name}.date_start, ${this.table_name}.date_update, ${this.table_name}.date_end,
                    ${this.table_account_name}.id as account_id,  ${this.table_account_name}.title as account_title, ${this.table_account_name}.is_saving, 
                    ${this.table_record_name}.id  as record_id, ${this.table_record_name}.price, ${this.table_record_name}.date as record_date, ${this.table_record_name}.description, ${this.table_record_name}.type,
                    ${this.table_category_name}.title as category_title, ${this.table_category_name}.icon
                FROM 
                    ${this.table_name} 
                JOIN ${this.table_account_name}
                    ON ${this.table_account_name}.id = ${this.table_name}.id_account
                JOIN ${this.table_record_name}
                    ON ${this.table_record_name}.id = ${this.table_name}.id_record
                JOIN ${this.table_category_name}
                    ON ${this.table_category_name}.id = ${this.table_name}.id_category
                Where ${this.table_name}.is_archived = 0
                `
            );

            let future_transactions = [];

            for (let result of results) {
                let id_transaction = result['id'];
                let tags = await this.get_all_tags(id_transaction);
                let transaction = this.create_transaction(id_transaction, result, tags);

                future_transactions.push(transaction);
            }

            resolve(future_transactions);
        });
    }
    delete(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`DELETE FROM ${this.table_name} WHERE id = ?`, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        });
    }
    archive(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`
                UPDATE ${this.table_name} SET is_archived = ? WHERE id = ? 
            `, 1, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        });
    }

}