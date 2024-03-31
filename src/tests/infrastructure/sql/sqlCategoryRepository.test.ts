import sqlite3 from 'sqlite3';
import { open } from "sqlite";
import { SqlCategoryRepository } from "../../../infrastructure/sql/sqlCategoryRepository";
import { Category } from "@/core/entities/category";

describe('Test Category sql repository', () => {
    sqlite3.verbose();
    let db: any | null = null;
    let table_category_name = 'categories';

    beforeEach(async () => {
        db = await open({
            filename: '',
            driver: sqlite3.Database
        })
    });

    afterEach(async () => {
       if (db != null) {
            await db.exec(`DELETE FROM ${table_category_name}`)
       }
    });

    test('Create Category', async () => {
        let category_repo = new SqlCategoryRepository(db, table_category_name);
        await category_repo.create_table();
        
        let new_category: Category = {
            title: 'cat',
            icon: 'ico-cat'
        }

        let is_save = await category_repo.save(new_category);

        expect(is_save).toBe(true);
    });

    test('Get category', async () => {
        let category_repo = new SqlCategoryRepository(db, table_category_name);
        await category_repo.create_table();
        
        let new_category: Category = {
            title: 'cat',
            icon: 'ico-cat'
        }

        await category_repo.save(new_category);

        let category = await category_repo.get('cat');

        expect(category).toStrictEqual(new_category);
    });
});