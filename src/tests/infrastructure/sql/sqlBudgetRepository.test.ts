import sqlite3 from 'sqlite3';
import { open } from "sqlite";
import { SqlCategoryRepository } from '../../../infrastructure/sql/sqlCategoryRepository';
import { SqlTagRepository } from '../../../infrastructure/sql/sqlTagRepository';
import { Category } from '@/core/entities/category';
import { Tag } from '@/core/entities/tag';
import DateParser from '../../../core/entities/date_parser';
import { SqlBudgetCategoryRepository } from '../../../infrastructure/sql/sqlBudgetRepository';
import { BudgetWithCategory } from '../../../core/entities/budget';
import { dbBudgetCategory } from '../../../core/interactions/repositories/budgetRepository';

describe('Budget sql repository', () => {
    sqlite3.verbose();
    let db: any | null = null;
    let table_category_name = 'categories';
    let table_tag_name = 'tags';
    let table_budget_category_name = 'budget_categories';
    let table_budget_tag_name = 'budget_tags';

    beforeEach(async () => {
        db = await open({
            filename: '',
            driver: sqlite3.Database
        });

        /*let tag_repo = new SqlTagRepository(db, 'tags');
        await tag_repo.create_table();
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});*/
    });

    afterEach(async () => {
       if (db != null) {
            await db.exec(`DELETE FROM ${table_budget_category_name}`);
            //await db.exec(`DELETE FROM ${table_budget_tag_name}`);
            await db.exec(`DELETE FROM ${table_category_name}`);
            // await db.exec(`DELETE FROM ${table_tag_name}`);
       }
    });

    test('Create Budget category', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(db, table_budget_category_name);
        await budget_category_repo.create_table(table_category_name);

        let category_repo = new SqlCategoryRepository(db, table_category_name);
        await category_repo.create_table();
        let new_category: Category = {
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let true_response = '1-id';

        let budget: dbBudgetCategory = {
            id: true_response,
            title: 'title',
            target: 1500,
            period: 'Week',
            period_time: 1,
            categories: [new_category.title]
        };

        let is_saved = await budget_category_repo.save(budget);

        expect(is_saved).toBe(true);
    });

    test('Create Budget category', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(db, table_budget_category_name);
        await budget_category_repo.create_table(table_category_name);

        let category_repo = new SqlCategoryRepository(db, table_category_name);
        await category_repo.create_table();
        let new_category: Category = {
            title: 'cat',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        let true_response = '1-id';

        let budget: dbBudgetCategory = {
            id: true_response,
            title: 'title',
            target: 1500,
            period: 'Week',
            period_time: 1,
            categories: [new_category.title]
        };

        await budget_category_repo.save(budget);

        let budget_got = await budget_category_repo.get(true_response);

        expect(budget_got).not.toBeNull();
        expect(budget_got?.categories[0].title).toBe('cat');
        expect(budget_got?.title).toBe('title');
        expect(budget_got?.target).toBe(1500);
        expect(budget_got?.period).toBe('Week');
        expect(budget_got?.period_time).toBe(1);
    });

    
})