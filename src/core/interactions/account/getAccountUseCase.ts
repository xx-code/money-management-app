import { NotFoundError } from "../../errors/notFoundError";
import { AccountRepository } from "../../repositories/accountRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";

interface IGetAccountUseCase {    
    execute(id: string): void;
}

export type AccountResponse = {
    account_id: string
    title: string
    balance: number
}

export interface IGetAccountUseCaseResponse {
    success(account: AccountResponse): void
    fail(error: Error): void
}

export class GetAccountUseCase implements IGetAccountUseCase {
    private repository: AccountRepository;
    private transaction_repository: TransactionRepository;
    private presenter: IGetAccountUseCaseResponse;

    constructor(repo: AccountRepository, transaction_repo: TransactionRepository, presenter: IGetAccountUseCaseResponse) {
        this.repository = repo;
        this.transaction_repository = transaction_repo;
        this.presenter = presenter;
    }
    
    async execute(id: string): Promise<void> {
        try {
            let account = await this.repository.get(id);

            if (account == null) {
                throw new NotFoundError('Account Not Found');
            }

            let balance = await this.transaction_repository.getBalance({
                accounts: [id],
                tags: [],
                categories: [],
                start_date: null,
                end_date: null,
                price: null,
                type: null,
            });

            this.presenter.success({account_id: account.id, title: account.title, balance: balance});
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}