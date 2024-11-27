import { Tag } from "../domains/entities/tag";

export interface TagRepository {
    save(tag: Tag): Promise<boolean>;
    delete(title: string): Promise<boolean>;
    get(id: string): Promise<Tag|null>;
    getByName(value: string): Promise<Tag|null>
    getAll(): Promise<Tag[]>;
}