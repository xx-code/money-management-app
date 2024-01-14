import { Tag } from "../../entities/tag";
import { NotFoundError } from "../errors/notFoundError";
import { TagRepository } from "../repositories/tagRepository";

export interface IGetTagUseCase {
    execute(title: string): Tag;
}

export class GetTagUseCase implements IGetTagUseCase {
    private repository: TagRepository;

    constructor(repo: TagRepository) {
        this.repository = repo;
    }

    execute(title: string): Tag {
        try {
            let tag = this.repository.get(title);
            if (tag == null) {
                throw new NotFoundError('Tag no found');
            }
            return {
                title: tag.title
            };
        } catch(err) {
            throw err;
        }
    }
}