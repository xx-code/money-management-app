import { Category } from "@/core/entities/category";
import { CategoryRepository, dbCategory } from "../../core/interactions/repositories/categoryRepository";
import { open_database } from "../../config/sqlLiteConnection";


export class SqlCategoryRepository implements CategoryRepository {
    
    private db: any;
    public table_category_name: string;

    constructor(table_category_name: string) {
        this.table_category_name = table_category_name;
    }
    
    async init(db_file_name: string): Promise<void> {
        this.db = await open_database(db_file_name);
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_category_name} (
                title TEXT PRIMARY KEY,
                icon TEXT
            )
        `);
    }

    save(dbCategory: dbCategory): Promise<boolean> {
        return new Promise( async (resolve, reject) => {
            let result = await this.db.run(`
                INSERT INTO ${this.table_category_name} (title, icon) VALUES (?, ?)`,
                dbCategory.title, dbCategory.icon
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
            let result = await this.db.run(`DELETE FROM ${this.table_category_name} WHERE title = ?`, title);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        });
    }
    get(title: string): Promise<Category | null> {
        return new Promise( async (resolve, reject) => {
            let result = await this.db.get(`
                SELECT title, icon FROM ${this.table_category_name} WHERE title = ?`,
                title
            );

            if (result != undefined) {
                resolve({
                    title: result['title'], 
                    icon: result['icon']
                });
            } else {
                resolve(null);
            }
        });
    }
    get_all(): Promise<Category[]> {
        return new Promise( async (resolve, reject) => {
            let results = await this.db.all(`SELECT title, icon FROM ${this.table_category_name} `);

            let categories = [];

            for (let result of results) {
                categories.push({
                    title: result['title'], 
                    icon: result['icon']
                });
            }

            resolve(categories);
        });
    }
    
}