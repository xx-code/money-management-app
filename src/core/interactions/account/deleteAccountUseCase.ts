import { NotFoundError } from "../../errors/notFoundError";
import { AccountRepository } from "../repositories/accountRepository";

interface IDeleteAccountUseCase {
    execute(id: string): void;
}

export interface IDeleteAccountUseCaseResponse {
    success(id_delete: string): void;
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

            this.presenter.success(id);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}