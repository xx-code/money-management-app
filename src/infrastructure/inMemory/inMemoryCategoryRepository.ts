import { dbCategory } from "../../interactions/repositories/categoryRepository";
import { TagRepository, dbTag } from "../../interactions/repositories/tagRepository";

export class InMemoryCategoryRepository implements TagRepository {
    private db: Array<dbCategory> = [];

    get(title: string): dbCategory | null {
        let categories = this.db.filter((cat) => cat.title == title);

        if (categories.length <= 0) {
            return null;
        }

        return categories[0];
    }

    get_all(): dbCategory[] {
        return Array.from(this.db.values());
    }

    save(category: dbCategory): string {
        this.db.push({title: category.title, icon: category.icon});

        return category.title;
    }

    delete(title: string): boolean {
        let categories = this.db.filter((cat) => cat.title != title);

        if (categories.length >= this.db.length) {
            return false;
        }
        this.db = categories;
        
        return true;
    }
}