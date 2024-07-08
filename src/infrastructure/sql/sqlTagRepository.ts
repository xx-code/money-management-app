import { Tag } from "@/core/entities/tag";
import { TagRepository, dbTag } from "../../core/interactions/repositories/tagRepository";
import { open_database } from "../../config/sqlLiteConnection";


export class SqlTagRepository implements TagRepository {
    
    private db: any;
    public table_tag_name: string;
    constructor(table_tag_name: string) {
        this.table_tag_name = table_tag_name;
    }
    
    async init(db_file_name: string): Promise<void> {
        this.db = await open_database(db_file_name);
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_tag_name} (
                title TEXT PRIMARY KEY
            )
        `);
    }

    save(db_tag: dbTag): Promise<boolean> {
        return new Promise( async (resolve, reject) => {
            let result = await this.db.run(`
                INSERT INTO ${this.table_tag_name} (title) VALUES (?)`,
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
            let result = await this.db.run(`DELETE FROM ${this.table_tag_name} WHERE title = ?`, title);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        });
    }

    get(title: string): Promise<Tag | null> {
        return new Promise( async (resolve, reject) => {
            let result = await this.db.get(`
                SELECT title FROM ${this.table_tag_name} WHERE title = ?`,
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
            let results = await this.db.all(`SELECT title FROM ${this.table_tag_name}`);

            let tags = [];

            for (let result of results) {
                tags.push(result['title']);
            }

            resolve(tags);
        });
    }
}