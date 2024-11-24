import { Tag } from "../domains/entities/tag";

export interface TagRepository {
    save(tag: Tag): Promise<boolean>;
    delete(title: string): Promise<boolean>;
    get(title: string): Promise<Tag|null>;
    getAll(): Promise<Tag[]>;
}