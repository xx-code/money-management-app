import { Category } from "../domains/entities/category";


export interface CategoryRepository {
    save(dbCategory: Category): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    update(category: Category): Promise<boolean>;
    get(id: string): Promise<Category|null>;
    getByTitle(title: string): Promise<Category|null>;
    getAll(): Promise<Category[]>;
}