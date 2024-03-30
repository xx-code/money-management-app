import { Account } from "../../entities/account";
import { NotFoundError } from "../../errors/notFoundError";
import { AccountRepository } from "../repositories/accountRepository";

interface IGetAccountUseCase {    
    execute(id: string): void;
}

export interface IGetAccountUseCaseResponse {
    success(account: Account): void
    fail(error: Error): void
}

export class GetAccountUseCase implements IGetAccountUseCase {
    private repository: AccountRepository;
    private presenter: IGetAccountUseCaseResponse;

    constructor(repo: AccountRepository, presenter: IGetAccountUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }
    
    async execute(id: string): Promise<void> {
        try {
            let account = await this.repository.get(id);

            if (account == null) {
                throw new NotFoundError('Account Not Found');
            }

            this.presenter.success(account);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}