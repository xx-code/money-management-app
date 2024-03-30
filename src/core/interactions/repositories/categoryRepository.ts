import { Category } from "@/core/entities/category";

export type dbCategory = {
    title: string,
    icon: string
} 

export interface CategoryRepository {
    save(dbCategory: dbCategory): Promise<boolean>;
    delete(title: string): string;
    get(title: string): Category|null;
    get_all(): Array<Category>;
}