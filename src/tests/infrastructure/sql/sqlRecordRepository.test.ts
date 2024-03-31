import sqlite3 from 'sqlite3';
import { open } from "sqlite";
import { SqlRecordRepository } from "../../../infrastructure/sql/sqlRecordRepository";
import { Record } from "@/core/entities/transaction";

describe('Test Record sql repository', () => {
    sqlite3.verbose();
    let db: any | null = null;
    let table_name = 'records';

    beforeEach(async () => {
        db = await open({
            filename: '',
            driver: sqlite3.Database
        })
    });

    afterEach(async () => {
       if (db != null) {
            await db.exec(`DELETE FROM ${table_name}`)
       }
    });

    test('Create Record', async () => {
        let record_repo = new SqlRecordRepository(db, table_name);
        await record_repo.create_table();

        let new_record: Record = {
            id: 'record_1',
            date: new Date(),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        let is_saved = await record_repo.save(new_record);

        expect(is_saved).toBe(true);
    });

    test('Get record', async () => {
        let record_repo = new SqlRecordRepository(db, table_name);
        await record_repo.create_table();

        let new_record: Record = {
            id: 'record_1',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        let record = await record_repo.get('record_1');

        expect(record).toStrictEqual(new_record)
    });

    test('Get all records', async () => {
        let record_repo = new SqlRecordRepository(db, table_name);
        await record_repo.create_table();
        let new_record: Record = {
            id: 'record_1',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        let records = await record_repo.get_all();

        expect(records.length).toBe(1);

        expect(records[0]).toStrictEqual(new_record);
    });

    test('Get many by id records', async () => {
        let record_repo = new SqlRecordRepository(db, table_name);
        await record_repo.create_table();
        let new_record: Record = {
            id: 'record_1',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        let new_record2: Record = {
            id: 'record_2',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record2);

        let new_record3: Record = {
            id: 'record_3',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record3);

        let results = await record_repo.get_many_by_id(['record_1', 'record_2']);

        let records_id = [];
        for (let result of results) {
            records_id.push(result.id);
        }

        expect(records_id).toStrictEqual(['record_1', 'record_2']);
    });

    test('Update description', async () => {
        let record_repo = new SqlRecordRepository(db, table_name);
        await record_repo.create_table();
        let new_record: Record = {
            id: 'record_1',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        new_record.description = 'new description';

        let record_updated = await record_repo.update(new_record);

        expect(record_updated.description).toBe('new description');
    });

    test('Update price', async () => {
        let record_repo = new SqlRecordRepository(db, table_name);
        await record_repo.create_table();
        let new_record: Record = {
            id: 'record_1',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        new_record.price = 20;

        let record_updated = await record_repo.update(new_record);

        expect(record_updated.price).toBe(20);
    });


    test('Update type', async () => {
        let record_repo = new SqlRecordRepository(db, table_name);
        await record_repo.create_table();
        let new_record: Record = {
            id: 'record_1',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        new_record.type = 'Debit';

        let record_updated = await record_repo.update(new_record);

        expect(record_updated.type).toBe('Debit');
    });

    test('Update date', async () => {
        let record_repo = new SqlRecordRepository(db, table_name);
        await record_repo.create_table();
        let new_record: Record = {
            id: 'record_1',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        new_record.date = new Date(2024, 1, 22);

        let record_updated = await record_repo.update(new_record);

        expect(record_updated.date).toStrictEqual(new Date(2024, 1, 22));
    });

    test('delete record', async () => {
        let record_repo = new SqlRecordRepository(db, table_name);
        await record_repo.create_table();
        let new_record: Record = {
            id: 'record_1',
            date: new Date('2024-01-31'),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        let is_deleted = await record_repo.delete('record_1');

        expect(is_deleted).toBe(true);

        let records = await record_repo.get_all();

        expect(records.length).toBe(0);
    });
});