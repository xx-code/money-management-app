import { BudgetRepository } from '../../core/repositories/budgetRepository';
import { open_database } from "../../config/sqlLiteConnection";
import { MapperBudger } from '@/core/mappers/budget';
import { SqlLiteRepository } from './sql_lite_connector';
import { Budget } from '@/core/domains/entities/budget';

export class SqlLiteBudget extends SqlLiteRepository implements BudgetRepository {

    private async getAllCategories(id_budget: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            let result_category = await this.db.all(`
                SELECT * 
                FROM 
                    budget_categories
                WHERE budget_categories.id_budget = ?
                `,
                id_budget
            );

            let categories: string[] = []
            for (let result of result_category) {
                categories.push(result['id']);
            }

            resolve(categories);
        });
    }

    private async getAllTags(id_budget: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            let result_tag = await this.db.all(`
                SELECT * 
                FROM 
                    budget_tags
                WHERE budget_tags.id_budget = ?
                `,
                id_budget
            );

            let tags: string[] = []
            for (let result of result_tag) {
                tags.push(result['id']);
            }

            resolve(tags);
        });
    }

    save(request: Budget): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const dto = MapperBudger.to_persistence(request)

            let result = await this.db.run(`
                INSERT INTO budgets (id, title, target, period, period_time, date_start, date_update, is_archived, date_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                dto.id, dto.title, dto.target, dto.period, dto.period_time, dto.date_start, dto.date_update, 0, dto.date_end
            );

            let saved_category = true;
            if (request.categories.length > 0) {
                for (let category of request.categories) {
                    let result = await this.db.run(`
                        INSERT INTO budget_categories (id_budget, id_category) VALUES (?, ?)`,
                        request.id, category
                    );
                    saved_category = result != undefined;
                }
            }

            let saved_tag = true;
            if (request.tags.length > 0) {
                for (let tag of request.tags) {
                    let result = await this.db.run(`
                        INSERT INTO budget_tags (id_budget, id_tag) VALUES (?, ?)`,
                        request.id, tag
                    );
                    saved_tag = result != undefined;
                }
            }

            if (result['changes'] == 0 && saved_category && saved_tag) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    }
    
    get(id: string): Promise<Budget | null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`SELECT id, title, target, period, period_time, date_start, date_update, date_end FROM budgets WHERE id = ? and is_archived = 0`, id);
            
            if (result != undefined) {
                
                let categories = await this.getAllCategories(id);
                let tags = await this.getAllTags(id)

                let budget = MapperBudger.to_domain({
                    id: result['id'],
                    title: result['title'],
                    target: result['target'],
                    is_archived: result['is_archived'],
                    period: result['period'],
                    period_time: result['period_time'],
                    date_start: result['date_start'],
                    date_update: result['date_update'],
                    date_end: result['date_end'],
                    tags: tags,
                    categories: categories
                })

                resolve(budget);
            } else {
                resolve(null);
            }
        })
    }
    getAll(): Promise<Budget[]> {
        return new Promise(async (resolve, reject) => {
            let results = await this.db.all(`SELECT id, title, target, period, period_time, date_start, date_update, date_end FROM budgets Where is_archived = 0`);

            let budgets: Budget[] = [];

            for (let result of results) {
                let categories = await this.getAllCategories(result['id']);
                let tags = await this.getAllTags(result['id'])

                let budget = MapperBudger.to_domain({
                    id: result['id'],
                    title: result['title'],
                    target: result['target'],
                    is_archived: result['is_archived'],
                    period: result['period'],
                    period_time: result['period_time'],
                    date_start: result['date_start'],
                    date_update: result['date_update'],
                    date_end: result['date_end'],
                    tags: tags,
                    categories: categories
                })

                budgets.push(budget);
            }
            resolve(budgets);
        })
    }
    delete(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            // Todo: Transaction 
            let result = await this.db.run(`DELETE FROM budgets WHERE id = ?`, id);
            let result2 = await this.db.run(`DELETE FROM budget_tags WHERE id_budget = ?`, id);
            let result3 = await this.db.run(`DELETE FROM budget_categories WHERE id_budget = ?`, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            } 
        })
    }
    archived(id: string, balance: number): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`UPDATE budgets SET balance = ?, is_archived = ? WHERE id = ? `, balance, 1, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            } 
        })
    }
    update(request: Budget): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const dto = MapperBudger.to_persistence(request)
            
            await this.db.run(`UPDATE budgets SET title = ?, target = ?, period = ?, period_time = ?, date_start = ?, date_update = ?, date_end = ? WHERE id = ? `, 
                dto.title, dto.target, dto.period, dto.period_time, dto.date_start, dto.date_update, dto.date_end, dto.id);

            if (request.__delete_event_category.length > 0) {
                await this.db.run(`DELETE FROM budget_categories WHERE id_category in (?)`, request.__delete_event_category.toString());
            }

            if (request.__add_event_category.length > 0) {
                for (let category of request.__add_event_category) {
                    await this.db.run(`
                        INSERT INTO budget_categories (id_budget, id_category) VALUES (?, ?)`,
                        request.id, category
                    );
                }
            }

            if (request.__delete_event_tag.length > 0) {
                await this.db.run(`DELETE FROM budget_tags WHERE id_category in (?)`, request.__delete_event_tag.toString());
            } 

            if (request.__add_event_tag.length > 0) {
                for (let category of request.__add_event_tag) {
                    await this.db.run(`
                        INSERT INTO budgets_tags (id_budget, id_tag) VALUES (?, ?)`,
                        request.id, category
                    );
                }
            }

            resolve(true);
        })
    }
    
}

/*export class SqlBudgetRepository implements BudgetRepository {
    private db: any;
    private table_name: string;
    private create_table_query: string = ''

    constructor(table_name: string) {
        this.table_name = table_name;
        this.create_table_query = `
        CREATE TABLE IF NOT EXISTS ${this.table_name} (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            target INTEGER NOT NULL,
            date_start TEXT NOT NULL,
            date_update TEXT NOT NULL,
            date_end TEXT,
            is_archived INTEGER NOT NULL,
            period TEXT NULL,
            period_time INTEGER NOT NULL
        )     
        `
    }



    async init(db_file_name: string): Promise<void> {
        this.db = await open_database(db_file_name);
        await this.db.exec(this.create_table_query);

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name}_categories (
                id_budget TEXT NOT NULL,
                id_category TEXT NOT NULL,
                FOREIGN KEY (id_budget) REFERENCES ${this.table_name}(id)
                    ON DELETE CASCADE
            )
        `);

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_name}_tags (
                id_budget TEXT NOT NULL,
                id_tag TEXT NOT NULL,
                FOREIGN KEY (id_budget) REFERENCES ${this.table_name}(id)
                    ON DELETE CASCADE 
            )
        `);

        // await this.updateTable()
    }

    async updateTable() {
        try {
            await this.db.exec(`Select id, title, target , date_start, date_update, date_end, is_archived, period, period_time  from  budget_categories`)
        } catch(err: any) {
            await this.db.exec(`ALTER TABLE budget_categories RENAME TO ${this.table_name}_categ_old`)
            
            await this.db.exec(this.create_table_query);

            let results = await this.db.all(`SELECT * FROM budget_categories`);
            for(let result of results) {
                await this.db.run(`
                INSERT INTO ${this.table_name} (id, title, target, period, period_time, date_start, date_update, date_end, is_archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                result['id'], result['title'], result['target'], result['period'], result['period_time'], result['date_start'], result['date_to_update'], null, result['is_archived']
            );
            await this.db.exec(`${this.table_name}_old`)
            }
        } 
    }

    private async get_all_categories(id_budget: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            let result_category = await this.db.all(`
                SELECT * 
                FROM 
                    ${this.table_name}_categories
                WHERE ${this.table_name}_categories.id_budget = ?
                `,
                id_budget
            );

            let categories: string[] = []
            for (let result of result_category) {
                categories.push(result['id']);
            }

            resolve(categories);
        });
    }

    private async get_all_tags(id_budget: string): Promise<Tag[]> {
        return new Promise(async (resolve, reject) => {
            let result_tag = await this.db.all(`
                SELECT * 
                FROM 
                    ${this.table_name}_tags
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

    save(request: Budget): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const dto = MapperBudger.to_persistence(request)

            let result = await this.db.run(`
                INSERT INTO ${this.table_name} (id, title, target, period, period_time, date_start, date_update, is_archived, date_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                dto.id, dto.title, dto.target, dto.period, dto.period_time, dto.date_start, dto.date_update, 0, dto.date_end
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

            let saved_tag = true;
            if (request.tags.length > 0) {
                for (let tag of request.tags) {
                    let result = await this.db.run(`
                        INSERT INTO ${this.table_name}_tags (id_budget, id_tag) VALUES (?, ?)`,
                        request.id, tag
                    );
                    saved_tag = result != undefined;
                }
            }

            if (result['changes'] == 0 && saved_category && saved_tag) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }
    get(id: string): Promise<Budget | null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`SELECT id, title, target, period, period_time, date_start, date_update, date_end FROM ${this.table_name} WHERE id = ? and is_archived = 0`, id);
            
            if (result != undefined) {
                
                let categories = await this.get_all_categories(id);
                let tags = await this.get_all_tags(id)

                let budget = MapperBudger.to_domain({
                    id: result['id'],
                    title: result['title'],
                    target: result['target'],
                    is_archived: result['is_archived'],
                    period: result['period'],
                    period_time: result['period_time'],
                    date_start: result['date_start'],
                    date_update: result['date_update'],
                    date_end: result['date_end'],
                    tags: tags,
                    categories: categories
                })

                resolve(budget);
            } else {
                resolve(null);
            }


        });
    }
    get_all(): Promise<Budget[]> {
        return new Promise(async (resolve, reject) => {
            let results = await this.db.all(`SELECT id, title, target, period, period_time, date_start, date_update, date_end FROM ${this.table_name} Where is_archived = 0`);

            let budgets: Budget[] = [];

            for (let result of results) {
                let categories = await this.get_all_categories(result['id']);
                let tags = await this.get_all_tags(result['id'])

                let budget = MapperBudger.to_domain({
                    id: result['id'],
                    title: result['title'],
                    target: result['target'],
                    is_archived: result['is_archived'],
                    period: result['period'],
                    period_time: result['period_time'],
                    date_start: result['date_start'],
                    date_update: result['date_update'],
                    date_end: result['date_end'],
                    tags: tags,
                    categories: categories
                })

                budgets.push(budget);
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
    update(request: Budget): Promise<Budget> {
        return new Promise(async (resolve, reject) => {
            const dto = MapperBudger.to_persistence(request)
            
            await this.db.run(`UPDATE ${this.table_name} SET title = ?, target = ?, period = ?, period_time = ?, date_start = ?, date_update = ?, date_end = ? WHERE id = ? `, 
                dto.title, dto.target, dto.period, dto.period_time, dto.date_start, dto.date_update, dto.date_end, dto.id);

            let result_categories = await this.get_all_categories(dto.id);
            let result_tags = await this.get_all_tags(dto.id)


            let category_to_remove = [];
            let category_to_add = [];

            let categories = [];
            for(let result of result_categories) {
                if (!dto.categories.includes(result)) {
                    category_to_remove.push(result);
                }
                categories.push(result);
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

    archived(id: string, balance: number): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`UPDATE ${this.table_name} SET balance = ?, is_archived = ? WHERE id = ? `, balance, 1, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            } 
        })
    }

}*/