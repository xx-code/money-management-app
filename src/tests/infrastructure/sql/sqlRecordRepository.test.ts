import sqlite3 from 'sqlite3';
import { open } from "sqlite";
import { SqlRecordRepository } from "../../../infrastructure/sql/sqlRecordRepository";
import { Record } from "@/core/entities/transaction";

describe('Test Category sql repository', () => {
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
            date: new Date(new Date().toDateString()),
            description: 'un blabla',
            price: 15,
            type: 'Credit'
        };

        await record_repo.save(new_record);

        let record = await record_repo.get('record_1');

        expect(record).toStrictEqual(new_record)
    });
});