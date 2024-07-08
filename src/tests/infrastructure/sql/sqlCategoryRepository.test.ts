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
            filename: 'test.db',
            driver: sqlite3.Database
        })

        await db.exec(`DELETE FROM ${table_category_name}`)
    })

    afterEach(async () => {
        db = await open({
            filename: 'test.db',
            driver: sqlite3.Database
        })

        await db.exec(`DELETE FROM ${table_category_name}`)
    });

    test('Create Category', async () => {
        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db');
        
        let new_category: Category = {
            id: '1',
            title: 'cat',
            icon: 'ico-cat'
        }

        let is_save = await category_repo.save(new_category);

        expect(is_save).toBe(true);
    });

    test('Get category', async () => {
        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db');
        
        let new_category: Category = {
            id: '1',
            title: 'cat',
            icon: 'ico-cat'
        }

        await category_repo.save(new_category);

        let category = await category_repo.get('1');

        expect(category).toStrictEqual(new_category);
    });

    test('Get all category', async () => {
        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db');
        
        let new_category: Category = {
            id: '1',
            title: 'cat',
            icon: 'ico-cat'
        }

        await category_repo.save(new_category);

        let categories = await category_repo.get_all();

        expect(categories.length).toBe(1);

        expect(categories[0]).toStrictEqual(new_category);
    });

    test('delete category', async () => {
        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db');
        
        let new_category: Category = {
            id: '1',
            title: 'cat',
            icon: 'ico-cat'
        }

        await category_repo.save(new_category);

        let is_deleted = await category_repo.delete('1');

        expect(is_deleted).toBe(true);

        let categories = await category_repo.get_all();

        expect(categories.length).toBe(0);
    })
});