import { Tag } from "@/core/entities/tag";
import { RecordRepository } from "../../core/interactions/repositories/recordRepository";
import { Record } from "@/core/entities/transaction";

export class SqlRecordRepository implements RecordRepository {
    private db: any;
    private table_record_name: string;
    private is_table_exist: boolean = false;

    constructor(db: any, table_record_name: string) {
        this.db = db;
        this.table_record_name = table_record_name;
    }
    async create_table(): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_record_name} (
                id TEXT PRIMARY KEY,
                price INTEGER NOT NULL,
                date TEXT NOT NULL,
                description TEXT NOT NULL,
                type TEXT NOT NULL
            )
        `);
        this.is_table_exist = true;
    }
    save(request: Record): Promise<boolean> {
        return new Promise(async (resolve, rejects) => {
            if (!this.is_table_exist) {
                throw Error("Table category not created");
            }

            let result = await this.db.run(`
                INSERT INTO ${this.table_record_name} (id, price, date, description, type) VALUES (?, ?, ?, ?, ?)`,
                request.id, request.price, request.date.toString(), request.description, request.type
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
            if (!this.is_table_exist) {
                throw Error("Table category not created");
            }

            let result = await this.db.get(`SELECT id, price, date, description, type FROM ${this.table_record_name} WHERE id = ?`, id);
            if (result != undefined) {
                resolve({
                    id: result['id'],
                    date: new Date(result['date']),
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
        throw new Error("Method not implemented.");
    }
    get_many_by_id(ids: string[]): Promise<Record[]> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    update(request: Record): Promise<Record> {
        throw new Error("Method not implemented.");
    }
    
}