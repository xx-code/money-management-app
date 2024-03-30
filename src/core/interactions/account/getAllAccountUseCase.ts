import { Account } from "../../entities/account";
import { AccountRepository } from "../repositories/accountRepository";

interface IGetAllAccountUseCase {
    execute(): void
}

export interface IGetAllAccountUseCaseResponse {
    success(all_account: Array<Account>): void
    fail(err: Error): void
}

export class GetAllAccountUseCase implements IGetAllAccountUseCase{
    private repository: AccountRepository;
    private presenter: IGetAllAccountUseCaseResponse

    constructor(repo: AccountRepository, presenter: IGetAllAccountUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    execute(): void {
        try {
            let accounts = this.repository.get_all();

            this.presenter.success(accounts);
        } catch(err) {
            this.presenter.fail(err as Error);
        } 
    }
}