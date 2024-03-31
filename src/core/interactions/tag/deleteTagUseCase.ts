import { NotFoundError } from "../../errors/notFoundError";
import { TagRepository } from "../repositories/tagRepository";
import { formatted } from "../../entities/formatted";

export interface IDeleteTagUseCase {
    execute(title: string): void;
}

export interface IDeleteTagUseCaseResponse {
    success(is_deleted: boolean): void;
    fail(err: Error): void;
}

export class DeleteTagUseCase implements IDeleteTagUseCase {
    private repository: TagRepository;
    private presenter: IDeleteTagUseCaseResponse;
    
    constructor(repo: TagRepository, presenter: IDeleteTagUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(title: string): Promise<void> {
        try {
            title = formatted(title);
            let tag = await this.repository.get(title);

            if (tag == null) {
                throw new NotFoundError('Tag not found');
            }

            let is_deleted = await this.repository.delete(title);
            this.presenter.success(is_deleted);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}