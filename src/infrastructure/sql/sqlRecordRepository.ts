import { Tag } from "@/core/entities/tag";
import { RecordRepository } from "../../core/repositories/recordRepository";
import { Record } from "@/core/entities/transaction";
import DateParser from "../../core/entities/date_parser";
import { open_database } from "../../config/sqlLiteConnection";

export class SqlRecordRepository implements RecordRepository {
    private db: any;
    public table_record_name: string;

    constructor(table_record_name: string) {
        this.table_record_name = table_record_name;
    }
    async init(db_file_name: string): Promise<void> {
        this.db = await open_database(db_file_name);
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_record_name} (
                id TEXT PRIMARY KEY,
                price INTEGER NOT NULL,
                date TEXT NOT NULL,
                description TEXT NOT NULL,
                type TEXT NOT NULL
            )
        `);
    }
    save(request: Record): Promise<boolean> {
        return new Promise(async (resolve, rejects) => {
            let result = await this.db.run(`
                INSERT INTO ${this.table_record_name} (id, price, date, description, type) VALUES (?, ?, ?, ?, ?)`,
                request.id, request.price, request.date.toString('datetime'), request.description, request.type
            );

            if (result != undefined) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
    get(id: string): Promise<Record | null> {
        return new Promise(async (resolve, rejects) => {
            let result = await this.db.get(`SELECT id, price, date, description, type FROM ${this.table_record_name} WHERE id = ?`, id);
            
            if (result != undefined) {

                resolve({
                    id: result['id'],
                    date: DateParser.from_string(result['date']),
                    description: result['description'],
                    price: result['price'],
                    type: result['type']
                });
            } else {
                resolve(null);
            }
        });  
    }
    get_all(): Promise<Record[]> {
        return new Promise(async (resolve, rejects) => {
            let results = await this.db.all(`SELECT id, price, date, description, type FROM ${this.table_record_name}`);
            
            let records: Record[] = [];
            for (let result of results) {
                records.push({
                    id: result['id'],
                    date: DateParser.from_string(result['date']),
                    description: result['description'],
                    price: result['price'],
                    type: result['type']
                });  
            }

            resolve(records);
        });  
    }
    get_many_by_id(ids: string[]): Promise<Record[]> {
        return new Promise(async (resolve, rejects) => {
            let records: Record[] = [];
            for (let id of ids) {
                let record = await this.get(id);
                if (record != null) {
                    records.push(record);
                }
            }

            resolve(records);
        });
    }
    delete(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`DELETE FROM ${this.table_record_name} WHERE id = ?`, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        });
    }
    update(record: Record): Promise<Record> {
        return new Promise(async (resolve, reject) => {
            await this.db.run(`
                UPDATE ${this.table_record_name} SET price = ?, date = ?, description = ?, type = ? WHERE id = ? 
            `, record.price, record.date.toString(), record.description, record.type, record.id);

            let record_updated = await this.get(record.id);

            resolve(record_updated!);
        });
    }
    
}