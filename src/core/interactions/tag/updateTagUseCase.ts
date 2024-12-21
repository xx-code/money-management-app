import { isEmpty } from "@/core/domains/helpers";
import ValidationError from "@/core/errors/validationError";
import { TagRepository } from "@/core/repositories/tagRepository";

export type RequestUpdateTagUseCase = {
    id: string
    value: string|null
    color: string|null
} 

export interface IUpdateTagUseCase {
    execute(request: RequestUpdateTagUseCase): void;
}

export interface IUpdateTagUseCaseResponse {
    success(success: boolean): void;
    fail(err: Error): void;
}

export class UpdateTagUseCase implements IUpdateTagUseCase {
    private repository: TagRepository;
    private presenter: IUpdateTagUseCaseResponse;

    constructor(repo: TagRepository, presenter: IUpdateTagUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(request: RequestUpdateTagUseCase): Promise<void> {
        try {
            let tag = await this.repository.get(request.id);

            if (tag === null) {
                throw new ValidationError('This tag not existe');
            }

            if (!isEmpty(request.value)) {
                tag.setValue(request.value!)
            }

            if (!isEmpty(request.color)) {
                tag.color = request.color
            }

            let is_updated = await this.repository.update(tag)

            this.presenter.success(is_updated);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}