import { Category } from "@/core/entities/category";
import { CategoryRepository, dbCategory } from "../../core/repositories/categoryRepository";
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
                id TEXT PRIMARY KEY,
                title TEXT,
                icon TEXT
            )
        `);
    }

    update(category: dbCategory): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await this.db.run(`
                UPDATE ${this.table_category_name} SET title = ?, icon = ? WHERE id = ? 
            `, category.title, category.icon, category.id);

            let category_updated = await this.get(category.id);

            resolve(category_updated !== null);
        });
    }

    save(dbCategory: dbCategory): Promise<boolean> {
        return new Promise( async (resolve, reject) => {
            let result = await this.db.run(`
                INSERT INTO ${this.table_category_name} (id, title, icon) VALUES (?, ?, ?)`,
                dbCategory.id, dbCategory.title, dbCategory.icon
            );

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    }
    delete(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`DELETE FROM ${this.table_category_name} WHERE id = ?`, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        });
    }

    get_by_title(title: string): Promise<Category | null> {
        return new Promise( async (resolve, reject) => {
            let result = await this.db.get(`
                SELECT id, title, icon FROM ${this.table_category_name} WHERE title = ?`,
                title
            );

            if (result != undefined) {
                resolve({
                    id: result['id'],
                    title: result['title'], 
                    icon: result['icon']
                });
            } else {
                resolve(null);
            }
        });
    }

    get(id: string): Promise<Category | null> {
        return new Promise( async (resolve, reject) => {
            let result = await this.db.get(`
                SELECT id, title, icon FROM ${this.table_category_name} WHERE id = ?`,
                id
            );

            if (result != undefined) {
                resolve({
                    id: result['id'],
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
            let results = await this.db.all(`SELECT id, title, icon FROM ${this.table_category_name} `);

            let categories = [];

            for (let result of results) {
                categories.push({
                    id: result['id'],
                    title: result['title'], 
                    icon: result['icon']
                });
            }

            resolve(categories);
        });
    }
    
}