import { Account, AccountDisplay } from "../../entities/account";
import { AccountRepository } from "../repositories/accountRepository";
import { TransactionRepository } from "../repositories/transactionRepository";

interface IGetAllAccountUseCase {
    execute(is_saving:boolean): void
}

export interface IGetAllAccountUseCaseResponse {
    success(all_account: Array<AccountDisplay>): void
    fail(err: Error): void
}

export class GetAllAccountUseCase implements IGetAllAccountUseCase{
    private repository: AccountRepository;
    private presenter: IGetAllAccountUseCaseResponse;
    private transaction_repository: TransactionRepository;

    constructor(repo: AccountRepository, transaction_repository: TransactionRepository, presenter: IGetAllAccountUseCaseResponse) {
        this.repository = repo;
        this.transaction_repository = transaction_repository;
        this.presenter = presenter;
    }

    async execute(is_saving:boolean=false): Promise<void> {
        try {
            let accounts = await this.repository.get_all();
            
            accounts = accounts.filter(account => account.is_saving === is_saving)
            let accounts_display: AccountDisplay[] = [];
            for (let account of accounts) {
                let balance = await this.transaction_repository.get_balance({
                    accounts: [account.id],
                    tags: [],
                    categories: [],
                    start_date: null,
                    end_date: null,
                    price: null,
                    type: null
                });
                accounts_display.push({...account, balance: balance});
            }
            this.presenter.success(accounts_display);
        } catch(err) {
            this.presenter.fail(err as Error);
        } 
    }
}