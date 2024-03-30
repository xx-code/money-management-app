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

        let is_saved = await account_repo.save(new_account);

        expect(is_saved).toBe(true);
    });
    
    test('Get account', async () => {
        let account_repo = new SqlAccountRepository(db, table_account_name);
        await account_repo.create_table();
        
        let true_response = '1-id';

        let new_account: Account = {
            id: true_response,
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };

        await account_repo.save(new_account);

        let account = await account_repo.get('1-id');

        expect(account).toStrictEqual(new_account);
    });

    test('Get all account', async () => {
        let account_repo = new SqlAccountRepository(db, table_account_name);
        await account_repo.create_table();

        let true_response = '1-id';

        let new_account: Account = {
            id: true_response,
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };

        await account_repo.save(new_account);

        let all_account = await account_repo.get_all();

        expect(all_account.length).toBe(1);
        expect(all_account[0]).toStrictEqual(new_account);
    });

    test('Update title of account', async () => {
        let account_repo = new SqlAccountRepository(db, table_account_name);
        await account_repo.create_table();

        let new_account: Account = {
            id: '1-id',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };

        await account_repo.save(new_account);

        new_account.title = 'new_title';

        let account_updated = await account_repo.update(new_account);

        expect(account_updated.title).toBe('new_title');
    });

    test('Update credit limit of account', async () => {
        let account_repo = new SqlAccountRepository(db, table_account_name);
        await account_repo.create_table();

        let new_account: Account = {
            id: '1-id',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };

        await account_repo.save(new_account);

        new_account.credit_limit = 500;

        let account_updated = await account_repo.update(new_account);

        expect(account_updated.credit_limit).toBe(500);
    });

    test('Update credit value of account', async () => {
        let account_repo = new SqlAccountRepository(db, table_account_name);
        await account_repo.create_table();

        let new_account: Account = {
            id: '1-id',
            title: 'title',
            credit_limit: 0,
            credit_value: 200
        };

        await account_repo.save(new_account);

        new_account.credit_value = 200;

        let account_updated = await account_repo.update(new_account);

        expect(account_updated.credit_value).toBe(200);
    });

    test('Delete account', async () => {
        let account_repo = new SqlAccountRepository(db, table_account_name);
        await account_repo.create_table();

        let new_account: Account = {
            id: '1-id',
            title: 'title',
            credit_limit: 0,
            credit_value: 200
        };

        await account_repo.save(new_account);

        let id_account_delete = await account_repo.delete('1-id');

        expect(id_account_delete).toBe(true);

        let res = await account_repo.get('1-id');
        
        expect(res).toBeNull();
    });
});
