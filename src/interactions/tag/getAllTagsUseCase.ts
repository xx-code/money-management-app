import { Tag } from "../../entities/tag";
import { TagRepository } from "../repositories/tagRepository";
import { reverseFormatted } from "../utils/formatted";

export interface IGetAllUseCase {
    execute(): Array<Tag>;
}

export class GetAllTagUseCase implements IGetAllUseCase {
    private repository: TagRepository;

    constructor(repo: TagRepository) {
        this.repository = repo;
    }

    execute(): Tag[] {
        try {
            let results = this.repository.get_all();

            for(let i = 0; i < results.length; i++) {
                results[i].title = reverseFormatted(results[i].title);
            }

            return results;
        } catch(err) {
            throw err;
        }
    }
}