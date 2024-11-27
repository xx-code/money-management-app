import { isEmpty } from "@/core/domains/helpers";
import { TagRepository } from "../../repositories/tagRepository";
import ValidationError from "@/core/errors/validationError";
import { Tag } from "@/core/domains/entities/tag";
import { CryptoService } from "@/core/adapters/libs";

export type RequestCreationTagUseCase = {
    value: string
    color: string|null
} 

export interface ICreationTagUseCase {
    execute(request: RequestCreationTagUseCase): void;
}

export interface ICreationTagUseCaseResponse {
    success(success: boolean): void;
    fail(err: Error): void;
}

export class CreationTagUseCase implements ICreationTagUseCase {
    private repository: TagRepository;
    private crypto: CryptoService
    private presenter: ICreationTagUseCaseResponse;

    constructor(repo: TagRepository, crypto: CryptoService, presenter: ICreationTagUseCaseResponse) {
        this.repository = repo;
        this.crypto = crypto
        this.presenter = presenter;
    }

    async execute(request: RequestCreationTagUseCase): Promise<void> {
        try {
            if (isEmpty(request.value)) {
                throw new ValidationError('Title field empty');
            }

            let tag = await this.repository.getByName(request.value);

            if (tag != null) {
                throw new ValidationError('This tag is already use');
            }

            let id_tag = this.crypto.generate_uuid_to_string()
            let is_saved = await this.repository.save(new Tag(id_tag, request.value, request.color));

            if (!is_saved) {
                throw new Error('Tag is not saved')
            }

            this.presenter.success(is_saved);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}