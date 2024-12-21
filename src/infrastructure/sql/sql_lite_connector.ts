import { open_database } from "@/config/sqlLiteConnection"

const SQL_LITE_DB_VERSION = 1
const DB_FILENAME = process.env.NODE_ENV === 'production' ? 'database.db' : 'testdb.db'; 


export class SqlLiteConnection {
    private static instance: SqlLiteConnection | null = null

    private constructor() {

    }

    public static async getInstance(): Promise<SqlLiteConnection> {
        return new Promise(async (resolve, reject) => {
            if (SqlLiteConnection.instance === null) {
                SqlLiteConnection.instance = new SqlLiteConnection()
                try {
                    await SqlLiteConnection.instance.createTable()
                } catch(err) {
                    reject('Error while try to create table: ' + err) 
                }
                
            }

            resolve(SqlLiteConnection.instance)
        })
    }

    public async getDb() {
        return await open_database(DB_FILENAME)
    }


    private async createTable() {
        let db = await this.getDb()

        let create_table_versions = `
            CREATE TABLE IF NOT EXISTS versions (
                value INTEGER NOT NULL
            )
        `
        await db.exec(create_table_versions)

        let results_version = await db.all(`SELECT value FROM versions WHERE value`)
        
        if (results_version.length === 0) {
            await db.run('INSERT INTO versions (value) VALUES (?)', SQL_LITE_DB_VERSION)
            await this.migrationTableV1(db)
        } else {
            let result_version = await db.get(`SELECT value FROM versions WHERE value = ?`, SQL_LITE_DB_VERSION)

            if (result_version['value'] !== SQL_LITE_DB_VERSION) {
                await db.run('UPDATE versions SET value = ?', SQL_LITE_DB_VERSION)
                await this.migrationTableV1(db)
            }
        }

        let create_table_account = `
            CREATE TABLE IF NOT EXISTS accounts (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                is_saving INTEGER NOT NULL
            )
        `
        await db.exec(create_table_account);


        let create_table_category = `
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                title TEXT,
                icon TEXT,
                color TEXT
            )    
        `
        await db.exec(create_table_category)

        let create_table_record = `
            CREATE TABLE IF NOT EXISTS records (
                id TEXT PRIMARY KEY,
                amount INTEGER NOT NULL,
                date TEXT NOT NULL,
                description TEXT NOT NULL,
                type TEXT NOT NULL
            )
        `
        await db.exec(create_table_record)

        let create_table_tag = `
            CREATE TABLE IF NOT EXISTS tags (
                id TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                color TEXT
            )
        `
        await db.exec(create_table_tag)

        let create_table_budgets = `
            CREATE TABLE IF NOT EXISTS budgets (
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

        await db.exec(create_table_budgets)

        let create_table_budget_categories = `
            CREATE TABLE IF NOT EXISTS budget_categories (
                id_budget TEXT NOT NULL,
                id_category TEXT NOT NULL,
                FOREIGN KEY (id_budget) REFERENCES budgets (id)
                    ON DELETE CASCADE
            )
        `

        await db.exec(create_table_budget_categories)

        let create_table_budget_tags =  `
            CREATE TABLE IF NOT EXISTS budget_tags (
                id_budget TEXT NOT NULL,
                id_tag TEXT NOT NULL,
                FOREIGN KEY (id_budget) REFERENCES budgets (id)
                    ON DELETE CASCADE 
            )
        `

        await db.exec(create_table_budget_tags)

        let create_table_saving = ` 
            CREATE TABLE IF NOT EXISTS savings (
                id TEXT PRIMARY KEY,
                id_account TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                target INTERGER NOT NULL,
                FOREIGN KEY (id_account) REFERENCES accounts (id)
            )
        `
        await db.exec(create_table_saving)

        let create_table_saving_items = `
            CREATE TABLE IF NOT EXISTS savings_items (
                id TEXT PRIMARY KEY,
                id_saving_goal TEXT NOT NULL,
                title TEXT NOT NULL,
                link TEXT,
                html_to_target TEXT,
                price INTERGERT,
                FOREIGN KEY (id_saving_goal) REFERENCES savings (id)
            )
        `
        await db.exec(create_table_saving_items)

        let create_table_transaction = `
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                id_account TEXT NOT NULL,
                id_category TEXT NOT NULL,
                id_record TEXT NOT NULL,
                FOREIGN KEY (id_account) REFERENCES accounts (id),
                FOREIGN KEY (id_category) REFERENCES categories(id),
                FOREIGN KEY (id_record) REFERENCES records (id)
                    ON DELETE CASCADE
            )
        `
        await db.exec(create_table_transaction)

        let create_table_transaction_tag = `
            CREATE TABLE IF NOT EXISTS transactions_tags (
                id_transaction TEXT NOT NULL,
                id_tag TEXT NOT NULL,
                FOREIGN KEY (id_transaction) REFERENCES transactions (id)
                    ON DELETE CASCADE
                FOREIGN KEY (id_tag) REFERENCES tags (id) 
            )
        `
        await db.exec(create_table_transaction_tag)

    }

    private async migrationTableV1(db: any) {
        await db.exec('BEGIN TRANSACTION')
        let add_new_column = `
            ALTER TABLE categories
            ADD color TEXT
        `
        await db.exec(add_new_column)

        let rename_tag_name = `
            ALTER TABLE tags RENAME TO old_tags
        `
       await db.exec(rename_tag_name)

        let create_table_tag = `
            CREATE TABLE IF NOT EXISTS tags (
                id TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                color TEXT
            )
        `

        await db.exec(create_table_tag)

        let results = await db.all(`SELECT * FROM old_tags`);
        for(let result of results) {
            await db.run(`
            INSERT INTO tags (id, value) VALUES (?, ?)`,
            result['title'], result['title']
        );}

        await db.exec(`ALTER TABLE records RENAME COLUMN price To amount`)

        await db.exec('DROP TABLE IF EXISTS budget_categories')

        await db.exec('DROP TABLE IF EXISTS budget_categories_categories')

        await db.exec('DROP TABLE IF EXISTS budget_tags')

        await db.exec('DROP TABLE IF EXISTS budget_tags_tags')

        await db.exec('DROP TABLE IF EXISTS budget_categories_old')

        await db.exec('COMMIT')
    }
}

export class SqlLiteRepository {
    protected db: any

    async init(sql_lite: SqlLiteConnection) {
        this.db = await sql_lite.getDb()
    }
}