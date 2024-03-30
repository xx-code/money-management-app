import { NotFoundError } from "../../errors/notFoundError";
import { TagRepository } from "../repositories/tagRepository";
import { formatted } from "../../entities/formatted";

export interface IDeleteTagUseCase {
    execute(title: string): void;
}

export interface IDeleteTagUseCaseResponse {
    success(title: string): void;
    fail(err: Error): void;
}

export class DeleteTagUseCase implements IDeleteTagUseCase {
    private repository: TagRepository;
    private presenter: IDeleteTagUseCaseResponse;
    
    constructor(repo: TagRepository, presenter: IDeleteTagUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    execute(title: string): void {
        try {
            title = formatted(title);
            let tag = this.repository.get(title);

            if (tag == null) {
                throw new NotFoundError('Tag not found');
            }

            let response = this.repository.delete(title);
            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}