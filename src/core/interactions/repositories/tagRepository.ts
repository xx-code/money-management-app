import { Tag } from "@/core/entities/tag";

export type dbTag = {
    title: string
} 

export interface TagRepository {
    save(tag: dbTag): Promise<boolean>;
    delete(title: string): Promise<boolean>;
    get(title: string): Promise<Tag|null>;
    get_all(): Promise<Tag[]>;
}