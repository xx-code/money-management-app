import { BudgetWithCategory, BudgetWithTag } from '@/core/entities/budget';
import { BudgetCategoryRepository, BudgetTagRepository, dbBudgetCategory, dbBudgetTag } from '../../core/interactions/repositories/budgetRepository';
import { Category } from '@/core/entities/category';
import { Tag } from '@/core/entities/tag';
import DateParser from '../../core/entities/date_parser';
import { open_database } from "../../config/sqlLiteConnection";


export class SqlBudgetCategoryRepository implements BudgetCategoryRepository {
    private db: any;
    private table_name: string;
    private table_category_name: string = '';

    constructor(table_name: string) {
        this.table_name = table_name;
    }

    async init(db_file_name: string, table_category_name: string): Promise<void> {
        this.db = await open_database(db_file_name);
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
    private db: any;
    private table_name: string;
    private table_tag_name: string = '';

    constructor(table_name: string) {
        this.table_name = table_name;
    }

    async init(db_file_name: string, table_tag_name: string): Promise<void> {
        this.db = await open_database(db_file_name);
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name} (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                target INTEGER NOT NULL,
                date_start TEXT NOT NULL,
                date_end TEXT NOT NULL
            )
        `);

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name}_tags (
                id_budget TEXT NOT NULL,
                id_tag TEXT NOT NULL,
                FOREIGN KEY (id_budget) REFERENCES ${this.table_name}(id)
                    ON DELETE CASCADE
                FOREIGN KEY (id_tag) REFERENCES ${table_tag_name}(title)  
            )
        `);

        this.table_tag_name = table_tag_name;
    }

    private async get_all_tags(id_budget: string): Promise<Tag[]> {
        return new Promise(async (resolve, reject) => {
            let result_tag = await this.db.all(`
                SELECT * 
                FROM 
                    ${this.table_name}_tags
                JOIN ${this.table_tag_name}
                    ON ${this.table_tag_name}.title = ${this.table_name}_tags.id_tag
                WHERE ${this.table_name}_tags.id_budget = ?
                `,
                id_budget
            );

            let tags: Tag[] = []
            for (let result of result_tag) {
                tags.push(result['title']);
            }

            resolve(tags);
        });
    }

    save(request: dbBudgetTag): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`
                INSERT INTO ${this.table_name} (id, title, target, date_start, date_end) VALUES (?, ?, ?, ?, ?)`,
                request.id, request.title, request.target, request.date_start.toString(), request.date_end.toString()
            );

            let saved_category = true;
            if (request.tags.length > 0) {
                for (let tag of request.tags) {
                    let result = await this.db.run(`
                        INSERT INTO ${this.table_name}_tags (id_budget, id_tag) VALUES (?, ?)`,
                        request.id, tag
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
    get(id: string): Promise<BudgetWithTag | null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`SELECT id, title, target, date_start, date_end FROM ${this.table_name} WHERE id = ?`, id);
            
            if (result != undefined) {
                
                let [year, month, day] = result['date_start'].split('-')
                let date_start = new DateParser(Number(year), Number(month), Number(day));

                [year, month, day] = result['date_end'].split('-')
                let date_end = new DateParser(Number(year), Number(month), Number(day));


                resolve({
                    id: result['id'],
                    title: result['title'],
                    target: result['target'],
                    date_start: date_start,
                    date_end: date_end,
                    tags: await this.get_all_tags(result['id'])
                });
            } else {
                resolve(null);
            }
        });
    }
    get_all(): Promise<BudgetWithTag[]> {
        return new Promise(async (resolve, reject) => {

            let results = await this.db.all(`SELECT id, title, target, date_start, date_end FROM ${this.table_name}`);

            let budgets: BudgetWithTag[] = [];

            for (let result of results) {
                let [year, month, day] = result['date_start'].split('-')
                let date_start = new DateParser(Number(year), Number(month), Number(day));

                [year, month, day] = result['date_end'].split('-')
                let date_end = new DateParser(Number(year), Number(month), Number(day));

                budgets.push({
                    id: result['id'],
                    target: result['target'],
                    title: result['title'],
                    date_start: date_start,
                    date_end: date_end,
                    tags: await this.get_all_tags(result['id'])
                });
            }
            resolve(budgets);
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
    update(request: dbBudgetTag): Promise<BudgetWithTag> {
        return new Promise(async (resolve, reject) => {
            await this.db.run(`UPDATE ${this.table_name} SET title = ?, target = ?, date_start = ?, date_end = ? WHERE id = ? `, 
            request.title, request.target, request.date_start.toString(), request.date_end.toString(), request.id);

            let result_tag = await this.db.all(`
                SELECT * 
                FROM 
                    ${this.table_name}_tags
                JOIN ${this.table_tag_name}
                    ON ${this.table_tag_name}.title = ${this.table_name}_tags.id_tag
                WHERE ${this.table_name}_tags.id_budget = ?
                `,
                request.id
            );


            let tag_to_remove = [];
            let tag_to_add = [];

            let tags = [];
            for(let result of result_tag) {
                if (!request.tags.includes(result['id_tag'])) {
                    tag_to_remove.push(result['id_tag']);
                }
                tags.push(result['id_tag']);
            }

            for (let tag of request.tags) {
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
                        INSERT INTO ${this.table_name}_tags (id_budget, id_tag) VALUES (?, ?)`,
                        request.id, tag
                    );
                }
            }

            let budget = await this.get(request.id);

            resolve(budget!);
        });
    }
}