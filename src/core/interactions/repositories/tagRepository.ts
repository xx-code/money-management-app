import { Tag } from "@/core/entities/tag";

export type dbTag = {
    title: string
} 

export interface TagRepository {
    save(tag: dbTag): string;
    save_multiple(tags: dbTag[]): string;
    delete(title: string): string;
    get(title: string): Tag|null;
    get_all(): Array<Tag>;
}