import sqlite3 from 'sqlite3';
import { open } from "sqlite";
import { SqlTransactionRepository } from "../../../infrastructure/sql/sqlTransactionRepository";
import { SqlAccountRepository } from "../../../infrastructure/sql/sqlAccountRepository";
import { SqlCategoryRepository } from "../../../infrastructure/sql/sqlCategoryRepository";
import { SqlRecordRepository } from "../../../infrastructure/sql/sqlRecordRepository";
import { SqlTagRepository } from "../../../infrastructure/sql/sqlTagRepository";
import { Tag } from '@/core/entities/tag';
import { Account } from '@/core/entities/account';
import { Category } from '@/core/entities/category';
import { Transaction, Record } from '@/core/entities/transaction';
import { dbTransaction } from '@/core/interactions/repositories/transactionRepository';

describe('Test transaction sql repository', () => {
    sqlite3.verbose();
    let db: any | null = null;
    let table_name = 'transactions';
    let table_category_name = 'categories';
    let table_account_name = 'accounts';
    let table_tag_name = 'tags';
    let table_record_name = 'records'

    beforeEach(async () => {
        db = await open({
            filename: '',
            driver: sqlite3.Database
        })
    });

    afterEach(async () => {
       if (db != null) {
            await db.exec(`DELETE FROM ${table_name}`);
            await db.exec(`DELETE FROM ${table_category_name}`);
            await db.exec(`DELETE FROM ${table_account_name}`);
            await db.exec(`DELETE FROM ${table_tag_name}`);
            await db.exec(`DELETE FROM ${table_record_name}`);
       }
    });

    test('Test create add new transaction with category', async () => {
        let account_repo = new SqlAccountRepository(db, 'accounts');
        await account_repo.create_table();

        let new_account: Account = {
            id: '1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let category_repo = new SqlCategoryRepository(db, 'categories');
        await category_repo.create_table();
        let new_category: Category = {
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let tag_repo = new SqlTagRepository(db, 'tags');
        await tag_repo.create_table();
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        let record_repo = new SqlRecordRepository(db, 'records');
        await record_repo.create_table();

        let new_record: Record = {
            id: 'record_1',
            date: new Date(),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        let transaction_repo = new SqlTransactionRepository(db, table_name);
        await transaction_repo.create_table('accounts', 'categories', 'tags', 'records');

        let new_transaction: dbTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [],
            category_ref: 'cat',
            record_ref: 'record_1'
        }
        let is_saved = await transaction_repo.save(new_transaction);

        expect(is_saved).toBe(true);
    });
});