import sqlite3 from 'sqlite3';
import { open } from "sqlite";
import { SqlAccountRepository } from "../../../infrastructure/sql/sqlAccountRepository";
import { Account } from "@/core/entities/account";

describe('Account sql repository', () => {
    sqlite3.verbose();
    let db: any | null = null;
    let table_account_name = 'accounts';

    beforeEach(async () => {
        db = await open({
            filename: '',
            driver: sqlite3.Database
        })
    });

    afterEach(async () => {
       if (db != null) {
            await db.exec(`DELETE FROM ${table_account_name}`)
       }
    });

    test('Creation account', async () => {
        let account_repo = new SqlAccountRepository(db, table_account_name);
        await account_repo.create_table();

        let true_response = '1-id';

        let new_account: Account = {
            id: true_response,
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };

        let new_id = await account_repo.save(new_account);

        expect(new_id).toBe(true_response);
    });
});
