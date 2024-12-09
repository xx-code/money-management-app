import { Tag } from "@/core/domains/entities/tag";
import { TagRepository } from "../../core/repositories/tagRepository";
import { SqlLiteRepository } from "./sql_lite_connector";
import { TagDto, TagMapper } from "@/core/mappers/tag";

export class SqlLiteTag extends SqlLiteRepository implements TagRepository {
    save(tag: Tag): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let tag_dto = TagMapper.to_persistence(tag)
            let result = await this.db.run(`
                INSERT INTO tags (id, value, color) VALUES (?, ?, ?)`,
                tag_dto.id, tag_dto.value, tag_dto.color
            );

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    }

    delete(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`DELETE FROM tags WHERE title = ?`, id);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        })
    }

    get(id: string): Promise<Tag | null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`
                SELECT id, value, color FROM tags WHERE value = ?`,
                id
            );
            if (result != undefined) {
                let tag: TagDto = {
                    id: result['id'],
                    value: result['value'],
                    color: result['color']
                }
                resolve(TagMapper.to_domain(tag));
            } else {
                resolve(null);
            }
        })
    }
    getByName(value: string): Promise<Tag | null> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.get(`
                SELECT id, value, color FROM tags WHERE value = ?`,
                value
            );
            if (result != undefined) {
                let tag: TagDto = {
                    id: result['id'],
                    value: result['value'],
                    color: result['color']
                }
                resolve(TagMapper.to_domain(tag))
            } else {
                resolve(null);
            }
        })
    }
    getAll(): Promise<Tag[]> {
        return new Promise(async (resolve, reject) => {
            let results = await this.db.all(`SELECT id, value, color FROM tags`);

            let tags = [];

            for (let result of results) {
                let tag: TagDto = {
                    id: result['id'],
                    value: result['value'],
                    color: result['color']
                }
                tags.push(TagMapper.to_domain(tag));
            }

            resolve(tags);
        })
    }

}

/*export class SqlTagRepository implements TagRepository {
    
    private db: any;
    public table_tag_name: string;
    constructor(table_tag_name: string) {
        this.table_tag_name = table_tag_name;
    }
    
    async init(db_file_name: string): Promise<void> {
        this.db = await open_database(db_file_name);
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.table_tag_name} (
                title TEXT PRIMARY KEY
            )
        `);
    }

    save(db_tag: dbTag): Promise<boolean> {
        return new Promise( async (resolve, reject) => {
            let result = await this.db.run(`
                INSERT INTO ${this.table_tag_name} (title) VALUES (?)`,
                db_tag.title
            );

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    }

    delete(title: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let result = await this.db.run(`DELETE FROM ${this.table_tag_name} WHERE title = ?`, title);

            if (result['changes'] == 0) {
                resolve(false);
            } else {
                resolve(true)
            }
        });
    }

    get(title: string): Promise<Tag | null> {
        return new Promise( async (resolve, reject) => {
            let result = await this.db.get(`
                SELECT title FROM ${this.table_tag_name} WHERE title = ?`,
                title
            );
            if (result != undefined) {
                resolve(result['title']);
            } else {
                resolve(null);
            }
        });
    }
    get_all(): Promise<Tag[]> {
        return new Promise( async (resolve, reject) => {
            let results = await this.db.all(`SELECT title FROM ${this.table_tag_name}`);

            let tags = [];

            for (let result of results) {
                tags.push(result['title']);
            }

            resolve(tags);
        });
    }
}*/