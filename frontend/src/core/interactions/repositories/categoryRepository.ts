export type dbCategory = {
    title: string,
    icon: string
} 

export interface CategoryRepository {
    save(dbCategory: dbCategory): string;
    delete(title: string): boolean;
    get(title: string): dbCategory|null;
    get_all(): Array<dbCategory>;
}