import { NotFoundError } from "../../errors/notFoundError";
import { AccountRepository } from "../repositories/accountRepository";

interface IDeleteAccountUseCase {
    execute(id: string): void;
}

export interface IDeleteAccountUseCaseResponse {
    success(is_deleted: boolean): void;
    fail(err: Error): void;
}

export class DeleteAccountUseCase implements IDeleteAccountUseCase {
    private repository: AccountRepository;
    private presenter: IDeleteAccountUseCaseResponse;

    constructor(repo: AccountRepository, presenter: IDeleteAccountUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(id: string): Promise<void> {
        try {
            if (await this.repository.get(id) == null) {
                throw new NotFoundError('Account Not Found');
            }

            let is_deleted = await this.repository.delete(id);

            this.presenter.success(is_deleted);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}