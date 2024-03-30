import { Category } from "@/core/entities/category";
import { CategoryRepository, dbCategory } from "../../core/interactions/repositories/categoryRepository";


export class SqlCategoryRepository implements CategoryRepository {
    
    private db: any;
    private table_category_name: string;
    private is_table_exist: boolean = false;

    constructor(db: any, table_category_name: string) {
        this.db = db;
        this.table_category_name = table_category_name;
    }
    
    async create_table(): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_category_name} (
                title TEXT PRIMARY KEY,
                icon TEXT
            )
        `);
        this.is_table_exist = true;
    }

    save(dbCategory: dbCategory): Promise<boolean> {
        return new Promise( async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table account not created");
            }
    
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
    delete(title: string): string {
        throw new Error("Method not implemented.");
    }
    get(title: string): Category | null {
        throw new Error("Method not implemented.");
    }
    get_all(): Category[] {
        throw new Error("Method not implemented.");
    }
    
}