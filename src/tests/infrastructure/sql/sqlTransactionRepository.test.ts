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
import DateParser from '../../../core/entities/date_parser';

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
            date: DateParser.now(),
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

    test('Test create add new transaction with tag', async () => {
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
            date: DateParser.now(),
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
            tag_ref: [new_tag],
            category_ref: 'cat',
            record_ref: 'record_1'
        }
        let is_saved = await transaction_repo.save(new_transaction);

        expect(is_saved).toBe(true);
    });

    test('Get  transaction', async () => {
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
            date: DateParser.now(),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        let new_record_with_tag: Record = {
            id: 'record_2',
            date: DateParser.now(),
            description: 'un blabla 2',
            price: 18,
            type: 'Credit'
        };

        await record_repo.save(new_record_with_tag);

        let transaction_repo = new SqlTransactionRepository(db, table_name);
        await transaction_repo.create_table('accounts', 'categories', 'tags', 'records');

        let new_transaction: dbTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [],
            category_ref: 'cat',
            record_ref: 'record_1'
        }
        await transaction_repo.save(new_transaction);

        let new_transaction_with_tag: dbTransaction = {
            id: '2',
            account_ref: '1',
            tag_ref: [new_tag],
            category_ref: 'cat',
            record_ref: 'record_2'
        }
        await transaction_repo.save(new_transaction_with_tag);


        let transaction = await transaction_repo.get('1');

        expect(transaction).not.toBeNull();
        expect(transaction?.account.id).toBe('1');
        expect(transaction?.category.title).toBe('cat');
        expect(transaction?.record.price).toBe(15);

        let transaction_with_tag = await transaction_repo.get('2');

        expect(transaction_with_tag).not.toBeNull();
        expect(transaction_with_tag?.account.id).toBe('1');
        expect(transaction_with_tag?.category.title).toBe('cat');
        expect(transaction_with_tag?.record.price).toBe(18);
        expect(transaction_with_tag?.tags.length).toBe(1);
        expect(transaction_with_tag?.tags[0]).toBe('tag');
    });

    test('Pagination transactions', async () => {
        let account_repo = new SqlAccountRepository(db, 'accounts');
        await account_repo.create_table();

        let new_account: Account = {
            id: '1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        new_account = {
            id: '2',
            title: 'title2',
            credit_limit: 1000,
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

        new_category = {
            title: 'cat2',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        new_category = {
            title: 'cat3',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let tag_repo = new SqlTagRepository(db, 'tags');
        await tag_repo.create_table();
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        let record_repo = new SqlRecordRepository(db, 'records');
        await record_repo.create_table();

        let transaction_repo = new SqlTransactionRepository(db, table_name);
        await transaction_repo.create_table('accounts', 'categories', 'tags', 'records');

        let new_record: Record = {
            id: 'record_1',
            date: DateParser.now(),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        let new_transaction: dbTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [],
            category_ref: 'cat',
            record_ref: 'record_1'
        }
        await transaction_repo.save(new_transaction);
        
        new_record = {
            id: 'record_2',
            date: DateParser.now(),
            description: 'un blabla',
            price: 10,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '2',
            account_ref: '1',
            tag_ref: [],
            category_ref: 'cat2',
            record_ref: 'record_2'
        }
        await transaction_repo.save(new_transaction);

        new_record = {
            id: 'record_3',
            date: DateParser.now(),
            description: 'un blabla',
            price: 2,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '3',
            account_ref: '1',
            tag_ref: [],
            category_ref: 'cat3',
            record_ref: 'record_3'
        }
        await transaction_repo.save(new_transaction);


        let pagination = await transaction_repo.get_paginations(1, 1, null, {accounts: [], categories: [], tags: []});

        expect(pagination.transactions.length).toBe(1);
        expect(pagination.transactions[0]?.account.id).toBe('1');
        expect(pagination.transactions[0]?.record.price).toBe(15);
        expect(pagination.transactions[0]?.category.title).toBe('cat');
        expect(pagination.max_page).toBe(3);

        pagination = await transaction_repo.get_paginations(2, 1, null, {accounts: [], categories: [], tags: []});

        expect(pagination.transactions.length).toBe(1);
        expect(pagination.transactions[0]?.account.id).toBe('1');
        expect(pagination.transactions[0]?.record.price).toBe(10);
        expect(pagination.transactions[0]?.category.title).toBe('cat2');

        pagination = await transaction_repo.get_paginations(1, 2, null, {accounts: [], categories: [], tags: []});
        
        expect(pagination.transactions.length).toBe(2);
        expect(pagination.transactions[0]?.record.price).toBe(15);
        expect(pagination.transactions[1]?.record.price).toBe(10);

        new_record = {
            id: 'record_4',
            date: DateParser.now(),
            description: 'un blabla',
            price: 100,
            type: 'Debit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '4',
            account_ref: '2',
            tag_ref: [],
            category_ref: 'cat2',
            record_ref: 'record_4'
        }
        await transaction_repo.save(new_transaction);

        let account2 = await account_repo.get('2');
        pagination = await transaction_repo.get_paginations(1, 1, null, {accounts: [account2!], categories: [], tags: []});

        expect(pagination.transactions.length).toBe(1);
        expect(pagination.transactions[0]?.account.title).toBe('title2');

        new_record = {
            id: 'record_5',
            date: DateParser.now(),
            description: 'un blabla',
            price: 5,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '5',
            account_ref: '1',
            tag_ref: [new_tag],
            category_ref: 'cat2',
            record_ref: 'record_5'
        }
        await transaction_repo.save(new_transaction);

        pagination = await transaction_repo.get_paginations(1, 1, null, {accounts: [], categories: [], tags: [new_tag]});

        expect(pagination.transactions.length).toBe(1);
        expect(pagination.transactions[0]?.record.id).toBe('record_5');

        let category = await category_repo.get('cat2');
        pagination = await transaction_repo.get_paginations(1, 4, null, {accounts: [], categories: [category!], tags: []});

        expect(pagination.transactions.length).toBe(3);
        expect(pagination.transactions[0].category.title).toBe('cat2');
        expect(pagination.transactions[1].category.title).toBe('cat2');
        expect(pagination.transactions[2].category.title).toBe('cat2');
    });

    test('Get transaction by categeory with range date', async () => {
        let account_repo = new SqlAccountRepository(db, 'accounts');
        await account_repo.create_table();

        let new_account: Account = {
            id: '1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let tag_repo = new SqlTagRepository(db, 'tags');
        await tag_repo.create_table();

        let category_repo = new SqlCategoryRepository(db, 'categories');
        await category_repo.create_table();
        let new_category: Category = {
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        new_category = {
            title: 'cat2',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let record_repo = new SqlRecordRepository(db, 'records');
        await record_repo.create_table();

        let transaction_repo = new SqlTransactionRepository(db, table_name);
        await transaction_repo.create_table('accounts', 'categories', 'tags', 'records');

        let new_record: Record = {
            id: 'record_1',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        let new_transaction: dbTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [],
            category_ref: 'cat',
            record_ref: 'record_1'
        }
        await transaction_repo.save(new_transaction);

        new_record = {
            id: 'record_2',
            date: new DateParser(2024, 4, 5),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '2',
            account_ref: '1',
            tag_ref: [],
            category_ref: 'cat',
            record_ref: 'record_2'
        }
        await transaction_repo.save(new_transaction);

        new_record = {
            id: 'record_3',
            date: new DateParser(2024, 4, 6),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '3',
            account_ref: '1',
            tag_ref: [],
            category_ref: 'cat2',
            record_ref: 'record_3'
        }
        await transaction_repo.save(new_transaction);

        let transactions = await transaction_repo.get_transactions_by_categories(['cat'], new DateParser(2024, 4, 3), new DateParser(2024, 4, 8));

        expect(transactions.length).toBe(2);
        expect(transactions[0].category.title).toBe('cat');
        expect(transactions[0].record.id).toBe('record_1');
        expect(transactions[1].category.title).toBe('cat');
        expect(transactions[1].record.id).toBe('record_2');
    });

    test('Get transaction by tags with range date', async () => {
        let account_repo = new SqlAccountRepository(db, 'accounts');
        await account_repo.create_table();

        let new_account: Account = {
            id: '1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let tag_repo = new SqlTagRepository(db, 'tags');
        await tag_repo.create_table();

        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        new_tag = 'tag2';
        await tag_repo.save({title: new_tag});

        let category_repo = new SqlCategoryRepository(db, 'categories');
        await category_repo.create_table();
        let new_category: Category = {
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let transaction_repo = new SqlTransactionRepository(db, table_name);
        await transaction_repo.create_table('accounts', 'categories', 'tags', 'records');

        let record_repo = new SqlRecordRepository(db, 'records');
        await record_repo.create_table();

        let tag1 = await tag_repo.get('tag') 

        let new_record: Record = {
            id: 'record_1',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 16,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        let new_transaction: dbTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [tag1!],
            category_ref: 'cat',
            record_ref: 'record_1'
        }
        await transaction_repo.save(new_transaction);

        let tag2 = await tag_repo.get('tag2') 

        new_record = {
            id: 'record_2',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 25,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '2',
            account_ref: '1',
            tag_ref: [tag1!],
            category_ref: 'cat',
            record_ref: 'record_2'
        }
        await transaction_repo.save(new_transaction);

        new_record = {
            id: 'record_3',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 35,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '3',
            account_ref: '1',
            tag_ref: [tag2!],
            category_ref: 'cat',
            record_ref: 'record_3'
        }
        await transaction_repo.save(new_transaction);

        let transactions = await transaction_repo.get_transactions_by_tags([tag1!], new DateParser(2024, 4, 1), new DateParser(2024, 4, 5));

        expect(transactions.length).toBe(2);
        expect(transactions[0].tags[0]).toBe('tag');
        expect(transactions[1].tags[0]).toBe('tag');

        transactions = await transaction_repo.get_transactions_by_tags([tag2!], new DateParser(2024, 4, 1), new DateParser(2024, 4, 5));

        expect(transactions.length).toBe(1);
        expect(transactions[0].tags[0]).toBe('tag2');
    });

    test('Balance of transaction', async () => {
        let account_repo = new SqlAccountRepository(db, 'accounts');
        await account_repo.create_table();

        let new_account: Account = {
            id: '1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let tag_repo = new SqlTagRepository(db, 'tags');
        await tag_repo.create_table();

        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        new_tag = 'tag2';
        await tag_repo.save({title: new_tag});

        let category_repo = new SqlCategoryRepository(db, 'categories');
        await category_repo.create_table();
        let new_category: Category = {
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let transaction_repo = new SqlTransactionRepository(db, table_name);
        await transaction_repo.create_table('accounts', 'categories', 'tags', 'records');

        let record_repo = new SqlRecordRepository(db, 'records');
        await record_repo.create_table();

        let tag1 = await tag_repo.get('tag') 

        let new_record: Record = {
            id: 'record_1',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 100,
            type: 'Debit'
        };
        await record_repo.save(new_record);

        let new_transaction: dbTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [tag1!],
            category_ref: 'cat',
            record_ref: 'record_1'
        }
        await transaction_repo.save(new_transaction);

        let tag2 = await tag_repo.get('tag2') 

        new_record = {
            id: 'record_2',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 25,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '2',
            account_ref: '1',
            tag_ref: [tag1!],
            category_ref: 'cat',
            record_ref: 'record_2'
        }
        await transaction_repo.save(new_transaction);

        new_record = {
            id: 'record_3',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 20,
            type: 'Credit'
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '3',
            account_ref: '1',
            tag_ref: [tag2!],
            category_ref: 'cat',
            record_ref: 'record_3'
        }
        await transaction_repo.save(new_transaction);

        let balance = await transaction_repo.get_account_balance('1');

        expect(balance).toBe(55);
    });

    test('Delete Transacation', async () => {
        let account_repo = new SqlAccountRepository(db, 'accounts');
        await account_repo.create_table();

        let new_account: Account = {
            id: '1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let tag_repo = new SqlTagRepository(db, 'tags');
        await tag_repo.create_table();

        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        new_tag = 'tag2';
        await tag_repo.save({title: new_tag});

        let category_repo = new SqlCategoryRepository(db, 'categories');
        await category_repo.create_table();
        let new_category: Category = {
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let transaction_repo = new SqlTransactionRepository(db, table_name);
        await transaction_repo.create_table('accounts', 'categories', 'tags', 'records');

        let record_repo = new SqlRecordRepository(db, 'records');
        await record_repo.create_table();

        let tag1 = await tag_repo.get('tag') 

        let new_record: Record = {
            id: 'record_1',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 100,
            type: 'Debit'
        };
        await record_repo.save(new_record);

        let new_transaction: dbTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [tag1!],
            category_ref: 'cat',
            record_ref: 'record_1'
        }
        await transaction_repo.save(new_transaction);

        let is_delete = await transaction_repo.delete('1');

        expect(is_delete).toBe(true);
        expect(await transaction_repo.get('1')).toBeNull();

        expect(await record_repo.get('1')).toBeNull();
    });
});