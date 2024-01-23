import { TagRepository, dbTag } from "../../interactions/repositories/tagRepository";

export class InMemoryTagRepository implements TagRepository {
    private db: Map<string, dbTag> = new Map();

    get(title: string): dbTag | null {
        let tag = this.db.get(title);

        if (tag == undefined) {
            return null;
        }

        return tag;
    }

    get_all(): dbTag[] {
        return Array.from(this.db.values());
    }

    save(tag: dbTag): string {
        this.db.set(tag.title, {title: tag.title});

        return tag.title;
    }

    delete(title: string): boolean {
        let response = this.db.delete(title);

        return response;
    }
}