import { NotFoundError } from "../../errors/notFoundError";
import { TagRepository } from "../repositories/tagRepository";
import { formatted } from "../../../lib/formatted";

export interface IDeleteTagUseCase {
    execute(title: string): boolean;
}

export class DeleteTagUseCase implements IDeleteTagUseCase {
    private repository: TagRepository;
    
    constructor(repo: TagRepository) {
        this.repository = repo;
    }

    execute(title: string): boolean {
        try {
            title = formatted(title);
            let tag = this.repository.get(title);

            if (tag == null) {
                throw new NotFoundError('Tag not found');
            }

            let response = this.repository.delete(title);
            return response;
        } catch(err) {
            throw err;
        }
    }
}