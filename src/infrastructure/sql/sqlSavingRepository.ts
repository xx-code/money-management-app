import { SaveGoal } from "@/core/entities/save_goal";
import { open_database } from "../../config/sqlLiteConnection";
import { dbSaveGoal, dbUpdateSaveGoal, SavingRepository } from "@/core/interactions/repositories/savingRepository";

export class SqlSavingRepository implements SavingRepository {
    
    private db: any;
    public table_saving_name: string;
    private create_table_query: string;

    constructor(table_saving_name: string) {
        this.table_saving_name = table_saving_name;
        this.create_table_query =''
    }

    async init(db_file_name: string, table_account_name: string) {
        this.db = await open_database(db_file_name);
        this.create_table_query = `
            CREATE TABLE IF NOT EXISTS ${this.table_saving_name} (
                id TEXT PRIMARY KEY,
                id_account TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                target INTERGER NOT NULL,
                FOREIGN KEY (id_account) REFERENCES ${table_account_name}(id)
            )
        `
        await this.db.exec(this.create_table_query)
    }

    create(save_goal: dbSaveGoal): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(
                `INSERT INTO ${this.table_saving_name} (id, id_account, title, description, target) VALUES (?, ?, ?, ?, ?)`,
                save_goal.id, save_goal.account_ref, save_goal.title, save_goal.description, save_goal.target
            )

            if (result != undefined) {
                resolve(true);
            } else {
                resolve(false);
            } 
        })
    }

    get(save_goal_id: string): Promise<SaveGoal|null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(
                `Select id, id_account, title, description, target From ${this.table_saving_name} Where id = ?`,
                save_goal_id
            )

            if(result != undefined) {
                let save_goal: SaveGoal = {
                    id: result['id'],
                    account_ref: result['id_account'],
                    description: result['title'],
                    target: result['description'],
                    title: result['target']
                }

                resolve(save_goal);
            } else {
                resolve(null);
            }
        })
    }

    getAll(): Promise<SaveGoal[]> {
        return new Promise(async (resolve, reject) => {
            let results = await this.db.run(
                `Select id, id_account, title, description, target From ${this.table_saving_name}`
            )

            let save_goals = [];

            for (let result of results) {
                let save_goal: SaveGoal = {
                    id: result['id'],
                    account_ref: result['id_account'],
                    description: result['title'],
                    target: result['description'],
                    title: result['target']
                }
                save_goals.push(save_goal);
            }

            resolve(save_goals)
        })
    }

    update(save_goal: dbUpdateSaveGoal): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(
                `Update ${this.table_saving_name} Set title = ?, description = ?, target = ? Where id = ?`,
                save_goal.title,
                save_goal.description,
                save_goal.target,
                save_goal.id
            )

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        })
    }

    delete(save_goal_id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`DELETE FROM ${this.table_saving_name} WHERE id = ?`, save_goal_id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        })
    }
}