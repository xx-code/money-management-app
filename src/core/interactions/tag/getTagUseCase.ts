import { Tag } from "../../entities/tag";
import { NotFoundError } from "../../errors/notFoundError";
import { TagRepository } from "../repositories/tagRepository";
import { formatted, reverseFormatted } from "../../entities/formatted";

export interface IGetTagUseCase {
    execute(title: string): void;
}

export interface IGetTagUseCaseResponse {
    success(tag: Tag): void;
    fail(err: Error): void;
}

export class GetTagUseCase implements IGetTagUseCase {
    private repository: TagRepository;
    private presenter: IGetTagUseCaseResponse

    constructor(repo: TagRepository, presenter: IGetTagUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    execute(title: string): void {
        try {
            let tag = this.repository.get(formatted(title));
            if (tag == null) {
                throw new NotFoundError('Tag no found');
            }
            
            this.presenter.success(tag);
        } catch(err) {
            this.presenter.fail(err as Error)
        }
    }
}