import sqlite3 from 'sqlite3';
import { open } from "sqlite";
import { SqlCategoryRepository } from '../../../infrastructure/sql/sqlCategoryRepository';
import { SqlTagRepository } from '../../../infrastructure/sql/sqlTagRepository';
import { Category } from '@/core/entities/category';
import { Tag } from '@/core/entities/tag';
import DateParser from '../../../core/entities/date_parser';
import { SqlBudgetCategoryRepository, SqlBudgetTagRepository } from '../../../infrastructure/sql/sqlBudgetRepository';
import { BudgetWithCategory } from '../../../core/entities/budget';
import { dbBudgetCategory, dbBudgetTag } from '../../../core/interactions/repositories/budgetRepository';

describe('Budget sql repository', () => {
    sqlite3.verbose();
    let db: any | null = null;
    let table_category_name = 'categories';
    let table_tag_name = 'tags';
    let table_budget_category_name = 'budget_categories';
    let table_budget_tag_name = 'budget_tags';


    afterEach(async () => {
        db = await open({
            filename: 'test.db',
            driver: sqlite3.Database
        });

        await db.exec(`DELETE FROM ${table_budget_category_name}`);
        await db.exec(`DELETE FROM ${table_budget_tag_name}`);
        await db.exec(`DELETE FROM ${table_category_name}`);
        await db.exec(`DELETE FROM ${table_tag_name}`);
        await db.exec(`DELETE FROM ${table_budget_category_name}_categories`)
        await db.exec(`DELETE FROM ${table_budget_tag_name}_tags`)
    });

    test('Create Budget category', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);
        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db', );

        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db', );
        let new_category: Category = {
            id: '111',
            title: 'cat-2',
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
            categories: [new_category.id]
        };

        let is_saved = await budget_category_repo.save(budget);

        expect(is_saved).toBe(true);
    });

    test('get Budget category', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);
        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db', );

        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db', );
        let new_category: Category = {
            id: '1gg',
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
            categories: [new_category.id]
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

    test('get all Budget category', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);
        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db', );

        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db', );
        let new_category: Category = {
            id: '1',
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
            categories: [new_category.id]
        };

        await budget_category_repo.save(budget);

        budget = {
            id: '2',
            title: 'title2',
            target: 150,
            period: 'Week',
            period_time: 1,
            categories: [new_category.id]
        };

        await budget_category_repo.save(budget);

        let budgets = await budget_category_repo.get_all();

        expect(budgets.length).toBe(2);
        expect(budgets[0].title).toBe('title');
        expect(budgets[1].title).toBe('title2');
    });
    
    test('delete budget category', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);
        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db', );

        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db', );
        let new_category: Category = {
            id: '3',
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
            categories: [new_category.id]
        };

        await budget_category_repo.save(budget);

        let is_deleted = await budget_category_repo.delete(true_response);

        expect(is_deleted).toBe(true);
        expect((await budget_category_repo.get(true_response))).toBeNull();
    });

    test('update budget category', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);
        let tag_repo = new SqlTagRepository('tags');
        await tag_repo.init('test.db', );

        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db');
        let new_category: Category = {
            id: 'g1',
            title: 'cat0',
            icon: 'ico-cat'
        }
        await category_repo.save(new_category);

        new_category = {
            id: '2',
            title: 'cat02',
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
            categories: [new_category.id]
        };

        await budget_category_repo.save(budget);

        let budget_updated = await budget_category_repo.update({
            id: true_response,
            title: 'title1',
            target: 1530,
            period: 'Month',
            period_time: 3,
            categories: [new_category.id]
        });

        expect(budget_updated.title).toBe('title1');
        expect(budget_updated.target).toBe(1530);
        expect(budget_updated.period).toBe('Month');
        expect(budget_updated.period_time).toBe(3);

        budget = {
            id: '2',
            title: 'title',
            target: 1500,
            period: 'Week',
            period_time: 1,
            categories: ['g1']
        };

        await budget_category_repo.save(budget);

        budget_updated = await budget_category_repo.update({
            id: '2',
            title: 'title',
            target: 1500,
            period: 'Month',
            period_time: 3,
            categories: ['g1', '2']
        });

        expect(budget_updated.categories.length).toBe(2);
        expect(budget_updated.categories[1].title).toBe('cat02');

        budget_updated = await budget_category_repo.update({
            id: '2',
            title: 'title',
            target: 1500,
            period: 'Month',
            period_time: 3,
            categories: ['2']
        });

        expect(budget_updated.categories.length).toBe(1);
        expect(budget_updated.categories[0].title).toBe('cat02');
    });

    test('Create Budget tag', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db', );
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);
        

        let tag_repo = new SqlTagRepository(table_tag_name);
        await tag_repo.init('test.db', );
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        let true_response = '12-id';

        let budget: dbBudgetTag = {
            id: true_response,
            title: 'title',
            target: 1500,
            date_start: new DateParser(2024, 4, 1),
            date_end: new DateParser(2024, 4, 7),
            tags: [new_tag]
        };

        let is_saved = await budget_tag_repo.save(budget);

        expect(is_saved).toBe(true);
    });

    test('get Budget tag', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db', );
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);

        let tag_repo = new SqlTagRepository(table_tag_name);
        await tag_repo.init('test.db', );
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        let true_response = '1-id';

        let budget: dbBudgetTag = {
            id: true_response,
            title: 'title',
            target: 1500,
            date_start: new DateParser(2024, 4, 1),
            date_end: new DateParser(2024, 4, 7),
            tags: [new_tag]
        };

        await budget_tag_repo.save(budget);

        let budget_got = await budget_tag_repo.get(true_response);

        expect(budget_got).not.toBeNull();
        expect(budget_got?.tags[0]).toBe('tag');
        expect(budget_got?.title).toBe('title');
        expect(budget_got?.target).toBe(1500);
        expect(budget_got?.date_start).toStrictEqual(new DateParser(2024, 4, 1));
        expect(budget_got?.date_end).toStrictEqual(new DateParser(2024, 4, 7));
    });

    test('get all Budget tag', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db', );
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);

        let tag_repo = new SqlTagRepository(table_tag_name);
        await tag_repo.init('test.db', );
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        let true_response = '1-id';

        let budget: dbBudgetTag = {
            id: true_response,
            title: 'title',
            target: 1500,
            date_start: new DateParser(2024, 4, 1),
            date_end: new DateParser(2024, 4, 7),
            tags: [new_tag]
        };

        await budget_tag_repo.save(budget);

        budget = {
            id: '2',
            title: 'title2',
            target: 1520,
            date_start: new DateParser(2024, 4, 1),
            date_end: new DateParser(2024, 4, 7),
            tags: [new_tag]
        };

        await budget_tag_repo.save(budget);

        let budgets = await budget_tag_repo.get_all();

        expect(budgets.length).toBe(2);
        expect(budgets[0].title).toBe('title');
        expect(budgets[1].title).toBe('title2');
    });

    test('delete budget tag', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db', );
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);

        let tag_repo = new SqlTagRepository(table_tag_name);
        await tag_repo.init('test.db', );
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        let true_response = '1-id';

        let budget: dbBudgetTag = {
            id: true_response,
            title: 'title',
            target: 1500,
            date_start: new DateParser(2024, 4, 1),
            date_end: new DateParser(2024, 4, 7),
            tags: [new_tag]
        };

        await budget_tag_repo.save(budget);

        let is_deleted = await budget_tag_repo.delete(true_response);

        expect(is_deleted).toBe(true);
        expect((await budget_tag_repo.get(true_response))).toBeNull();
    });

    test('update budget tag', async () => {
        let budget_category_repo = new SqlBudgetCategoryRepository(table_budget_category_name);
        await budget_category_repo.init('test.db', table_category_name);
        let category_repo = new SqlCategoryRepository(table_category_name);
        await category_repo.init('test.db', );
        let budget_tag_repo = new SqlBudgetTagRepository(table_budget_tag_name);
        await budget_tag_repo.init('test.db', table_tag_name);

        let tag_repo = new SqlTagRepository(table_tag_name);
        await tag_repo.init('test.db', );
        let new_tag: Tag = 'tag';
        await tag_repo.save({title: new_tag});

        new_tag = 'tag2';
        await tag_repo.save({title: new_tag});


        let true_response = '1-id';

        let budget: dbBudgetTag = {
            id: true_response,
            title: 'title',
            target: 1500,
            date_start: new DateParser(2024, 4, 1),
            date_end: new DateParser(2024, 4, 7),
            tags: [new_tag]
        };

        await budget_tag_repo.save(budget);

        let budget_updated = await budget_tag_repo.update({
            id: true_response,
            title: 'title1',
            target: 1530,
            date_start: new DateParser(2024, 4, 2),
            date_end: new DateParser(2024, 4, 3),
            tags: [new_tag]
        });

        expect(budget_updated.title).toBe('title1');
        expect(budget_updated.target).toBe(1530);
        expect(budget_updated.date_start).toStrictEqual(new DateParser(2024, 4, 2));
        expect(budget_updated.date_end).toStrictEqual(new DateParser(2024, 4, 3));

        budget = {
            id: '2',
            title: 'title2',
            target: 1500,
            date_start: new DateParser(2024, 4, 2),
            date_end: new DateParser(2024, 4, 3),
            tags: ['tag']
        };

        await budget_tag_repo.save(budget);

        budget_updated = await budget_tag_repo.update({
            id: '2',
            title: 'title2',
            target: 1500,
            date_start: new DateParser(2024, 4, 2),
            date_end: new DateParser(2024, 4, 3),
            tags: ['tag', 'tag2']
        });

        expect(budget_updated.tags.length).toBe(2);
        expect(budget_updated.tags[1]).toBe('tag2');

        budget_updated = await budget_tag_repo.update({
            id: '2',
            title: 'title2',
            target: 1500,
            date_start: new DateParser(2024, 4, 2),
            date_end: new DateParser(2024, 4, 3),
            tags: ['tag2']
        });

        expect(budget_updated.tags.length).toBe(1);
        expect(budget_updated.tags[0]).toBe('tag2');
    });
})