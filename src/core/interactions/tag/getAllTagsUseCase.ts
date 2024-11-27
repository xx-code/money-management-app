import { TagRepository } from "../../repositories/tagRepository";

export type TagOutput = {
    id: string
    value: string
    color: string|null
}
 
export interface IGetAllTagUseCase {
    execute(): void;
}

export interface IGetAllTagUseCaseResponse {
    success(tags: TagOutput[]): void;
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
            let results = await this.repository.getAll();

            let tags: TagOutput[] = []
            for(let result of results) {
                tags.push({
                    id: result.id,
                    value: result.getValue(),
                    color: result.color
                })
            }  

            this.presenter.success(tags);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}