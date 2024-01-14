import { Tag } from "../../entities/tag";
import { TagRepository } from "../repositories/tagRepository";

export interface IGetAllUseCase {
    execute(): Array<Tag>;
}

export class GetAllUseCase implements IGetAllUseCase {
    private repository: TagRepository;

    constructor(repo: TagRepository) {
        this.repository = repo;
    }

    execute(): Tag[] {
        try {
            let use_case = this.repository.get_all();

            return use_case;
        } catch(err) {
            throw err;
        }
    }
}