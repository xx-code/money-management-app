import { BudgetWithCategory, BudgetWithTag } from '@/core/entities/budget';
import { BudgetCategoryRepository, BudgetTagRepository, dbBudgetCategory, dbBudgetTag } from '../../core/interactions/repositories/budgetRepository';
import { Category } from '@/core/entities/category';


export class SqlBudgetCategoryRepository implements BudgetCategoryRepository {
    private db: any;
    private table_name: string;
    private table_category_name: string = '';
    private is_table_exist: boolean = false;

    constructor(db: any, table_name: string) {
        this.db = db;
        this.table_name = table_name;
    }

    async create_table(table_category_name: string): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name} (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                target INTEGER NOT NULL,
                period TEXT NOT NULL,
                period_time INTEGER NOT NULL
            )
        `);

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name}_categories (
                id_budget TEXT NOT NULL,
                id_category TEXT NOT NULL,
                FOREIGN KEY (id_budget) REFERENCES ${this.table_name}(id)
                    ON DELETE CASCADE
                FOREIGN KEY (id_category) REFERENCES ${table_category_name}(title)  
            )
        `);

        this.table_category_name = table_category_name;
        this.is_table_exist = true;
    }

    private async get_all_categories(id_budget: string): Promise<Category[]> {
        return new Promise(async (resolve, reject) => {
            let result_category = await this.db.all(`
                SELECT * 
                FROM 
                    ${this.table_name}_categories
                JOIN ${this.table_category_name}
                    ON ${this.table_category_name}.title = ${this.table_name}_categories.id_category
                WHERE ${this.table_name}_categories.id_budget = ?
                `,
                id_budget
            );

            let categories: Category[] = []
            for (let result of result_category) {
                categories.push({
                    title: result['title'],
                    icon: result['icon']
                });
            }

            resolve(categories);
        });
    }

    save(request: dbBudgetCategory): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table budget not created");
            }

            let result = await this.db.run(`
                INSERT INTO ${this.table_name} (id, title, target, period, period_time) VALUES (?, ?, ?, ?, ?)`,
                request.id, request.title, request.target, request.period, request.period_time
            );

            let saved_category = true;
            if (request.categories.length > 0) {
                for (let category of request.categories) {
                    let result = await this.db.run(`
                        INSERT INTO ${this.table_name}_categories (id_budget, id_category) VALUES (?, ?)`,
                        request.id, category
                    );
                    saved_category = result != undefined;
                }
            }

            if (result['changes'] == 0 && saved_category) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }
    get(id: string): Promise<BudgetWithCategory | null> {
        return new Promise(async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table budget not created");
            }

            let result = await this.db.get(`SELECT id, title, target, period, period_time FROM ${this.table_name} WHERE id = ?`, id);
            
            if (result != undefined) {
                
                let categories = await this.get_all_categories(id);

                resolve({
                    id: result['id'],
                    title: result['title'],
                    target: result['target'],
                    period: result['period'],
                    period_time: result['period_time'],
                    categories: categories
                });
            } else {
                resolve(null);
            }


        });
    }
    get_all(): Promise<BudgetWithCategory[]> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    update(request: dbBudgetCategory): Promise<BudgetWithCategory> {
        throw new Error('Method not implemented.');
    }

}

export class SqlBudgetTagRepository implements BudgetTagRepository {
    save(request: dbBudgetTag): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    get(id: string): Promise<BudgetWithTag | null> {
        throw new Error('Method not implemented.');
    }
    get_all(): Promise<BudgetWithTag[]> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    update(request: dbBudgetTag): Promise<BudgetWithTag> {
        throw new Error('Method not implemented.');
    }
}