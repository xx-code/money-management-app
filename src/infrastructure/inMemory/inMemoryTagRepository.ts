import { TagRepository, dbTag } from "../../interactions/repositories/tagRepository";

export class InMemoryTagRepository implements TagRepository {
    private db: Array<dbTag> = [];

    get(title: string): dbTag | null {
        let tags = this.db.filter((tag) => tag.title == title);

        if (tags.length <= 0) {
            return null;
        }

        return tags[0];
    }

    get_all(): dbTag[] {
        return Array.from(this.db.values());
    }

    save(tag: dbTag): string {
        this.db.push({title: tag.title});

        return tag.title;
    }

    delete(title: string): boolean {
        let tags = this.db.filter((tag) => tag.title != title);

        if (tags.length >= this.db.length) {
            return false;
        }
        this.db = tags;

        return true;
    }
}