import { open_database } from "@/config/sqlLiteConnection"

class SqlLiteConnection {
    static #instance: SqlLiteConnection

    private constructor() {}

    public static getInstance(): SqlLiteConnection {
        if (SqlLiteConnection.#instance) {
            SqlLiteConnection.#instance = new SqlLiteConnection()
        }

        return SqlLiteConnection.#instance
    }

    private async createTable() {
        let db = await open_database('')

        let create_table_account = `
            CREATE TABLE IF NOT EXISTS accounts (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                is_saving INTEGER NOT NULL
            )
        `
        await db.exec(create_table_account);

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
        await db.exec(create_table_budgets);

    }
}