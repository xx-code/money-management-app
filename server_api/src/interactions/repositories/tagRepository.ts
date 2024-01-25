export type dbTag = {
    title: string
} 

export interface TagRepository {
    save(tag: dbTag): string;
    delete(title: string): boolean;
    get(title: string): dbTag|null;
    get_all(): Array<dbTag>;
}