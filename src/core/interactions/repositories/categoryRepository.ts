import { Category } from "@/core/entities/category";

export type dbCategory = {
    title: string,
    icon: string
} 

export interface CategoryRepository {
    save(dbCategory: dbCategory): Promise<boolean>;
    delete(title: string): Promise<boolean>;
    get(title: string): Promise<Category|null>;
    get_all(): Promise<Category[]>;
}