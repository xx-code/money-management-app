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

    execute(title: string): void {
        try {
            if (is_empty(title)) {
                throw new ValidationError('Title field empty');
            }

            title = formatted(title);

            let tag = this.repository.get(title);

            if (tag != null) {
                throw new ValidationError('This category is already use');
            }

            let response = this.repository.save({
                title: title 
            });

            this.presenter.success(response);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}