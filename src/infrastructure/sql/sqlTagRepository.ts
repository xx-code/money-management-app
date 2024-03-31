import { Tag } from "@/core/entities/tag";
import { TagRepository, dbTag } from "../../core/interactions/repositories/tagRepository";


export class SqlTagRepository implements TagRepository {
    
    private db: any;
    private table_tage_name: string;
    private is_table_exist: boolean = false;

    constructor(db: any, table_tage_name: string) {
        this.db = db;
        this.table_tage_name = table_tage_name;
    }
    
    async create_table(): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_tage_name} (
                title TEXT PRIMARY KEY
            )
        `);
        this.is_table_exist = true;
    }

    save(db_tag: dbTag): Promise<boolean> {
        return new Promise( async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table tag not created");
            }
    
            let result = await this.db.run(`
                INSERT INTO ${this.table_tage_name} (title) VALUES (?)`,
                db_tag.title
            );

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    }

    delete(title: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`DELETE FROM ${this.table_tage_name} WHERE title = ?`, title);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        });
    }

    get(title: string): Promise<Tag | null> {
        return new Promise( async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table tag not created");
            }
    
            let result = await this.db.get(`
                SELECT title FROM ${this.table_tage_name} WHERE title = ?`,
                title
            );

            if (result != undefined) {
                resolve(result['title']);
            } else {
                resolve(null);
            }
        });
    }
    get_all(): Promise<Tag[]> {
        return new Promise( async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table tag not created");
            }
    
            let results = await this.db.all(`SELECT title FROM ${this.table_tage_name}`);

            let tags = [];

            for (let result of results) {
                tags.push(result['title']);
            }

            resolve(tags);
        });
    }
}