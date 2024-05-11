import { Category } from "@/core/entities/category";

export type dbCategory = {
    id: string
    title: string
    icon: string
} 

export interface CategoryRepository {
    save(dbCategory: dbCategory): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    update(category: dbCategory): Promise<boolean>;
    get(id: string): Promise<Category|null>;
    get_by_title(title: string): Promise<Category|null>;
    get_all(): Promise<Category[]>;
}