import { Tag } from "../../entities/tag";
import { TagRepository } from "../../repositories/tagRepository";
import { reverseFormatted } from "../../entities/formatted";

export interface IGetAllTagUseCase {
    execute(): void;
}

export interface IGetAllTagUseCaseResponse {
    success(tags: Tag[]): void;
    fail(err: Error): void;
}

export class GetAllTagUseCase implements IGetAllTagUseCase {
    private repository: TagRepository;
    private presenter: IGetAllTagUseCaseResponse;

    constructor(repo: TagRepository, presenter: IGetAllTagUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(): Promise<void> {
        try {
            let results = await this.repository.get_all();

            let tags: Tag[] = []
            for(let result of results) {
                tags.push(reverseFormatted(result))
            }  

            this.presenter.success(tags);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}