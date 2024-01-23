import { dbCategory } from "../../interactions/repositories/categoryRepository";
import { TagRepository, dbTag } from "../../interactions/repositories/tagRepository";

export class InMemoryCategoryRepository implements TagRepository {
    private db: Map<string, dbCategory> = new Map();

    get(title: string): dbCategory | null {
        let category = this.db.get(title);

        if (category == undefined) {
            return null;
        }

        return category;
    }

    get_all(): dbCategory[] {
        return Array.from(this.db.values());
    }

    save(category: dbCategory): string {
        this.db.set(category.title, {title: category.title, icon: category.icon});

        return category.title;
    }

    delete(title: string): boolean {
        let resposne = this.db.delete(title);

        return resposne;
    }
}