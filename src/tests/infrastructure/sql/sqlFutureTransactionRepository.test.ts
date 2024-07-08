import sqlite3 from 'sqlite3';
import { open } from "sqlite";
import { SqlFutureTransactionRepository } from "../../../infrastructure/sql/sqlFutureTransactionRepository";
import { SqlAccountRepository } from "../../../infrastructure/sql/sqlAccountRepository";
import { SqlCategoryRepository } from "../../../infrastructure/sql/sqlCategoryRepository";
import { SqlRecordRepository } from "../../../infrastructure/sql/sqlRecordRepository";
import { SqlTagRepository } from "../../../infrastructure/sql/sqlTagRepository";
import { Tag } from '../../../core/entities/tag';
import { Account } from '../../../core/entities/account';
import { Category } from '../../../core/entities/category';
import { Transaction, Record, TransactionType } from '../../../core/entities/transaction';
import { dbTransaction } from '../../../core/interactions/repositories/transactionRepository';
import DateParser from '../../../core/entities/date_parser';
import { dbFutureTransaction } from '@/core/interactions/repositories/futureTransactionRepository';

describe('Test Future transaction sql repository', () => {
    sqlite3.verbose();
    let db: any | null = null;
    let table_name = 'future_transactions';
    let table_category_name = 'categories';
    let table_account_name = 'accounts';
    let table_tag_name = 'tags';
    let table_record_name = 'records';


    afterEach(async () => {
        db = await open({
            filename: 'test.db',
            driver: sqlite3.Database
        })

        await db.exec(`DELETE FROM ${table_name}`);
        await db.exec(`DELETE FROM ${table_category_name}`);
        await db.exec(`DELETE FROM ${table_account_name}`);
        await db.exec(`DELETE FROM ${table_tag_name}`);
        await db.exec(`DELETE FROM ${table_record_name}`);
        await db.exec(`DELETE FROM ${table_name}_tags`)
    });

    test('Test create add new future transaction with category', async () => {
        let account_repo = new SqlAccountRepository('accounts');
        await account_repo.init('test.db');

        let new_account: Account = {
            id: 'dfd1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let category_repo = new SqlCategoryRepository('categories');
        await category_repo.init('test.db');
        let new_category: Category = {
            id: '1g',
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db');
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        let record_repo = new SqlRecordRepository('records');
        await record_repo.init('test.db');

        let new_record: Record = {
            id: 'record_J1',
            date: DateParser.now(),
            description: 'un blabla',
            price: 15,
            type: TransactionType.Credit
        };

        await record_repo.save(new_record);

        let transaction_repo = new SqlFutureTransactionRepository(table_name);
        await transaction_repo.init('test.db', 'accounts', 'categories', 'tags', 'records');

        let new_transaction: dbFutureTransaction = {
            id: '1',
            account_ref: 'dfd1',
            tag_ref: [],
            category_ref: '1g',
            record_ref: 'record_J1',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        let id_saved = await transaction_repo.save(new_transaction);

        expect(id_saved).toBe('1');
    });

    test('Test create add new future transaction with tag', async () => {
        let account_repo = new SqlAccountRepository('accounts');
        await account_repo.init('test.db');

        let new_account: Account = {
            id: 'fdf-1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let category_repo = new SqlCategoryRepository('categories');
        await category_repo.init('test.db');
        let new_category: Category = {
            id: '1',
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db');
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        let record_repo = new SqlRecordRepository('records');
        await record_repo.init('test.db');

        let new_record: Record = {
            id: 'record_11',
            date: DateParser.now(),
            description: 'un blabla',
            price: 15,
            type: TransactionType.Credit
        };

        await record_repo.save(new_record);

        let transaction_repo = new SqlFutureTransactionRepository(table_name);
        await transaction_repo.init('test.db', 'accounts', 'categories', 'tags', 'records');

        let new_transaction: dbFutureTransaction = {
            id: '5',
            account_ref: 'fdf-1',
            tag_ref: [new_tag],
            category_ref: 'cat',
            record_ref: 'record_1',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        let id_saved = await transaction_repo.save(new_transaction);

        expect(id_saved).toBe('5');
    });

    test('Get future transaction', async () => {
        let account_repo = new SqlAccountRepository('accounts');
        await account_repo.init('test.db');

        let new_account: Account = {
            id: 'fgfg-1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let category_repo = new SqlCategoryRepository('categories');
        await category_repo.init('test.db');
        let new_category: Category = {
            id: '1',
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db');
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        let record_repo = new SqlRecordRepository('records');
        await record_repo.init('test.db');

        let new_record: Record = {
            id: 'record_1',
            date: DateParser.now(),
            description: 'un blabla',
            price: 15,
            type: TransactionType.Credit
        };

        await record_repo.save(new_record);

        let new_record_with_tag: Record = {
            id: 'record_2',
            date: DateParser.now(),
            description: 'un blabla 2',
            price: 18,
            type: TransactionType.Credit
        };

        await record_repo.save(new_record_with_tag);

        let transaction_repo = new SqlFutureTransactionRepository(table_name);
        await transaction_repo.init('test.db', 'accounts', 'categories', 'tags', 'records');

        let new_transaction: dbFutureTransaction = {
            id: '1',
            account_ref: 'fgfg-1',
            tag_ref: [],
            category_ref: '1',
            record_ref: 'record_1',
            is_archived: false,
            period: 'Day',
            period_time: 4,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        await transaction_repo.save(new_transaction);

        let new_transaction_with_tag: dbFutureTransaction = {
            id: '2',
            account_ref: 'fgfg-1',
            tag_ref: [new_tag],
            category_ref: '1',
            record_ref: 'record_2',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        await transaction_repo.save(new_transaction_with_tag);


        let transaction = await transaction_repo.get('1');

        expect(transaction).not.toBeNull();
        expect(transaction?.account.id).toBe('fgfg-1');
        expect(transaction?.category.title).toBe('cat');
        expect(transaction?.record.price).toBe(15);
        expect(transaction?.period_time).toBe(4);

        let transaction_with_tag = await transaction_repo.get('2');

        expect(transaction_with_tag).not.toBeNull();
        expect(transaction_with_tag?.account.id).toBe('fgfg-1');
        expect(transaction_with_tag?.category.title).toBe('cat');
        expect(transaction_with_tag?.record.price).toBe(18);
        expect(transaction_with_tag?.tags.length).toBe(1);
        expect(transaction_with_tag?.tags[0]).toBe('tag');
        expect(transaction_with_tag?.period_time).toBe(3);
    });

    test('Get all future transactions', async () => {
        let account_repo = new SqlAccountRepository('accounts');
        await account_repo.init('test.db');

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

        let category_repo = new SqlCategoryRepository('categories');
        await category_repo.init('test.db');
        let new_category: Category = {
            id: '1',
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        new_category = {
            id: '2',
            title: 'cat2',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        new_category = {
            id: '3',
            title: 'cat3',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db');
        let new_tag: Tag = 'tag1';
        await tag_repo.save({title: new_tag});

        let record_repo = new SqlRecordRepository('records');
        await record_repo.init('test.db');

        let transaction_repo = new SqlFutureTransactionRepository(table_name);
        await transaction_repo.init('test.db', 'accounts', 'categories', 'tags', 'records');

        let new_record: Record = {
            id: 'record_1',
            date: DateParser.now(),
            description: 'un blabla',
            price: 15,
            type: TransactionType.Credit
        };
        await record_repo.save(new_record);

        let new_transaction: dbFutureTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [],
            category_ref: '1',
            record_ref: 'record_1',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        await transaction_repo.save(new_transaction);
        
        new_record = {
            id: 'record_2',
            date: DateParser.now(),
            description: 'un blabla',
            price: 10,
            type: TransactionType.Credit
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '2',
            account_ref: '1',
            tag_ref: [],
            category_ref: '2',
            record_ref: 'record_2',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        await transaction_repo.save(new_transaction);

        new_record = {
            id: 'record_3',
            date: DateParser.now(),
            description: 'un blabla',
            price: 2,
            type: TransactionType.Credit
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '3',
            account_ref: '1',
            tag_ref: [],
            category_ref: '3',
            record_ref: 'record_3',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        await transaction_repo.save(new_transaction);


        let responses = await transaction_repo.get_all();

        expect(responses.length).toBe(3);
    });


    test('Delete future Transacation', async () => {
        let account_repo = new SqlAccountRepository('accounts');
        await account_repo.init('test.db');

        let new_account: Account = {
            id: '1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db');

        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        new_tag = 'tag2';
        await tag_repo.save({title: new_tag});

        let category_repo = new SqlCategoryRepository('categories');
        await category_repo.init('test.db');
        let new_category: Category = {
            id: '1',
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let transaction_repo = new SqlFutureTransactionRepository(table_name);
        await transaction_repo.init('test.db', 'accounts', 'categories', 'tags', 'records');

        let record_repo = new SqlRecordRepository('records');
        await record_repo.init('test.db');

        let tag1 = await tag_repo.get('tag') 

        let new_record: Record = {
            id: 'record_1',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 100,
            type: TransactionType.Debit
        };
        await record_repo.save(new_record);

        let new_transaction: dbFutureTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [tag1!],
            category_ref: '1',
            record_ref: 'record_1',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        await transaction_repo.save(new_transaction);

        let is_delete = await transaction_repo.delete('1');

        expect(is_delete).toBe(true);
        expect(await transaction_repo.get('1')).toBeNull();

        expect(await record_repo.get('1')).toBeNull();
    });

    test('archive future Transacation', async () => {
        let account_repo = new SqlAccountRepository('accounts');
        await account_repo.init('test.db');

        let new_account: Account = {
            id: '1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db');

        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        new_tag = 'tag2';
        await tag_repo.save({title: new_tag});

        let category_repo = new SqlCategoryRepository('categories');
        await category_repo.init('test.db');
        let new_category: Category = {
            id: '1',
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let transaction_repo = new SqlFutureTransactionRepository(table_name);
        await transaction_repo.init('test.db', 'accounts', 'categories', 'tags', 'records');

        let record_repo = new SqlRecordRepository('records');
        await record_repo.init('test.db');

        let tag1 = await tag_repo.get('tag') 

        let new_record: Record = {
            id: 'record_1',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 100,
            type: TransactionType.Debit
        };
        await record_repo.save(new_record);

        let new_transaction: dbFutureTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [tag1!],
            category_ref: '1',
            record_ref: 'record_1',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        await transaction_repo.save(new_transaction);

        let is_delete = await transaction_repo.archive('1');

        expect(is_delete).toBe(true);

        let response = await transaction_repo.get('1')
        expect(response?.is_archived).toBe(1);
    });

    test('Update future transaction', async () => {
        let account_repo = new SqlAccountRepository('accounts');
        await account_repo.init('test.db');

        let new_account: Account = {
            id: '1',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };
        await account_repo.save(new_account);

        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db');

        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        new_tag = 'tag2';
        await tag_repo.save({title: new_tag});

        let category_repo = new SqlCategoryRepository('categories');
        await category_repo.init('test.db');
        let new_category: Category = {
            id: 'v1',
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        new_category = {
            id: 'v2',
            title: 'cat2',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let transaction_repo = new SqlFutureTransactionRepository(table_name);
        await transaction_repo.init('test.db', 'accounts', 'categories', 'tags', 'records');

        let record_repo = new SqlRecordRepository('records');
        await record_repo.init('test.db');

        let tag1 = await tag_repo.get('tag')
        let tag2 = await tag_repo.get('tag2') 

        let new_record: Record = {
            id: 'record_1',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 100,
            type: TransactionType.Debit
        };
        await record_repo.save(new_record);

        let new_transaction: dbFutureTransaction = {
            id: '1',
            account_ref: '1',
            tag_ref: [],
            category_ref: 'v1',
            record_ref: 'record_1',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        await transaction_repo.save(new_transaction);

        await transaction_repo.update({
            id: '1', 
            account_ref: '1', 
            record_ref: 'record_1', 
            tag_ref: [], 
            category_ref: 'v2',
            is_archived: false,
            period: 'Week',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        });
        
        let trans_1 = await transaction_repo.get('1')
        expect(trans_1?.category.title).toBe('cat2');
        expect(trans_1?.period).toBe('Week');

        new_record = {
            id: 'record_2',
            date: new DateParser(2024, 4, 4),
            description: 'un blabla',
            price: 100,
            type: TransactionType.Debit
        };
        await record_repo.save(new_record);

        new_transaction = {
            id: '2',
            account_ref: '1',
            tag_ref: [tag1!],
            category_ref: 'v1',
            record_ref: 'record_2',
            is_archived: false,
            period: 'Day',
            period_time: 3,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        }
        await transaction_repo.save(new_transaction);

        await transaction_repo.update({
            id: '2', 
            account_ref: '1', 
            record_ref: '1', 
            tag_ref: [tag1!, tag2!], 
            category_ref: 'v2',
            is_archived: false,
            period: 'Day',
            period_time: 5,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        });

        let trans_2 = await transaction_repo.get('2')

        expect(trans_2?.tags.length).toBe(2);
        expect(trans_2?.tags[1]).toBe(tag2);

        await transaction_repo.update({
            id: '2', 
            account_ref: '1', 
            record_ref: '1', 
            tag_ref: [tag2!], 
            category_ref: 'v2',
            is_archived: false,
            period: 'Day',
            period_time: 5,
            repeat: null,
            date_start: new DateParser(2014, 11, 10),
            date_update: new DateParser(2014, 11, 13),
            date_end: null
        });

        expect((await transaction_repo.get('2'))?.tags.length).toBe(1);
        expect((await transaction_repo.get('2'))?.tags[0]).toBe(tag2);
    });

    
});