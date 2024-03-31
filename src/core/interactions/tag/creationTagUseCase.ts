import { ValidationError } from "../../errors/validationError";
import { TagRepository } from "../repositories/tagRepository";
import { formatted } from "../../entities/formatted";
import { is_empty } from "../../entities/verify_empty_value";

export interface ICreationTagUseCase {
    execute(title: string): void;
}

export interface ICreationTagUseCaseResponse {
    success(title: string): void;
    fail(err: Error): void;
}

export class CreationTagUseCase implements ICreationTagUseCase {
    private repository: TagRepository;
    private presenter: ICreationTagUseCaseResponse;

    constructor(repo: TagRepository, presenter: ICreationTagUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(title: string): Promise<void> {
        try {
            if (is_empty(title)) {
                throw new ValidationError('Title field empty');
            }

            title = formatted(title);

            let tag = await this.repository.get(title);

            if (tag != null) {
                throw new ValidationError('This tag is already use');
            }

            let is_saved = await this.repository.save({
                title: title 
            });

            if (!is_saved) {
                throw new Error('Tag is not saved')
            }

            this.presenter.success(title);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}