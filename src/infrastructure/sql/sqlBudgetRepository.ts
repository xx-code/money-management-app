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
        return new Promise(async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table budget not created");
            }

            let results = await this.db.all(`SELECT id, title, target, period, period_time FROM ${this.table_name}`);

            let budgets: BudgetWithCategory[] = [];

            for (let result of results) {
                budgets.push({
                    id: result['id'],
                    target: result['target'],
                    title: result['title'],
                    period: result['period'],
                    period_time: result['period_time'],
                    categories: await this.get_all_categories(result['id'])
                });
            }
            resolve(budgets);
        });
    }
    delete(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table budget not created");
            }

            let result = await this.db.run(`DELETE FROM ${this.table_name} WHERE id = ?`, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            } 
        });
    }
    update(request: dbBudgetCategory): Promise<BudgetWithCategory> {
        return new Promise(async (resolve, reject) => {
            if (!this.is_table_exist) {
                throw Error("Table budget not created");
            }

            await this.db.run(`UPDATE ${this.table_name} SET title = ?, target = ?, period = ?, period_time = ? WHERE id = ? `, 
            request.title, request.target, request.period, request.period_time, request.id);

            let result_category = await this.db.all(`
                SELECT * 
                FROM 
                    ${this.table_name}_categories
                JOIN ${this.table_category_name}
                    ON ${this.table_category_name}.title = ${this.table_name}_categories.id_category
                WHERE ${this.table_name}_categories.id_budget = ?
                `,
                request.id
            );


            let category_to_remove = [];
            let category_to_add = [];

            let categories = [];
            for(let result of result_category) {
                if (!request.categories.includes(result['id_category'])) {
                    category_to_remove.push(result['id_category']);
                }
                categories.push(result['id_category']);
            }

            for (let category of request.categories) {
                if (!categories.includes(category)) {
                    category_to_add.push(category);
                }
            }

            if (category_to_remove.length > 0) {
                await this.db.run(`DELETE FROM ${this.table_name}_categories WHERE id_category in (?)`, category_to_remove.toString());
            }

            if (category_to_add.length > 0) {
                for (let category of category_to_add) {
                    await this.db.run(`
                        INSERT INTO ${this.table_name}_categories (id_budget, id_category) VALUES (?, ?)`,
                        request.id, category
                    );
                }
            }

            let budget = await this.get(request.id);

            resolve(budget!);
        });
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