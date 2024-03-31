import sqlite3 from 'sqlite3';
import { open } from "sqlite";
import { SqlTagRepository } from "../../../infrastructure/sql/sqlTagRepository";
import { Tag } from '@/core/entities/tag';

describe('Test tag sql repository', () => {
    sqlite3.verbose();
    let db: any | null = null;
    let table_tag_name = 'tags';

    beforeEach(async () => {
        db = await open({
            filename: '',
            driver: sqlite3.Database
        })
    });

    afterEach(async () => {
       if (db != null) {
            await db.exec(`DELETE FROM ${table_tag_name}`)
       }
    });

    test('Create tag', async () => {
        let tag_repo = new SqlTagRepository(db, table_tag_name);
        await tag_repo.create_table();
        
        let new_tag: Tag = 'tag';

        let is_save = await tag_repo.save({title: new_tag});

        expect(is_save).toBe(true);
    });

    test('Get tag', async () => {
        let tag_repo = new SqlTagRepository(db, table_tag_name);
        await tag_repo.create_table();
        
        let new_tag: Tag = 'tag';

        await tag_repo.save({title: new_tag});

        let tag = await tag_repo.get('tag');

        expect(tag).toStrictEqual(new_tag);
    });

    /*test('Get all tag', async () => {
        let tag_repo = new SqlTagRepository(db, table_tag_name);
        await tag_repo.create_table();
        
        let new_tag: Tag = 'tag';

        await tag_repo.save({title: new_tag});

        let categories = await tag_repo.get_all();

        expect(categories.length).toBe(1);

        expect(categories[0]).toStrictEqual(new_tag);
    });

    test('delete tag', async () => {
        let tag_repo = new SqlTagRepository(db, table_tag_name);
        await tag_repo.create_table();
        
        let new_tag: Tag = 'tag';

        await tag_repo.save({title: new_tag});

        let is_deleted = await tag_repo.delete('cat');

        expect(is_deleted).toBe(true);

        let categories = await tag_repo.get_all();

        expect(categories.length).toBe(0);
    })*/
});