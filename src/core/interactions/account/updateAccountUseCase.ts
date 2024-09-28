import { AccountRepository } from "../repositories/accountRepository";
import { Account } from "../../entities/account";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { is_empty } from '../../entities/verify_empty_value';

export type RequestUpdateAccountUseCase = {
    id: string;
    title: string|null;
    credit_value: number|null;
    credit_limit: number|null;
}

interface IUpdateAccountUseCase {
    execute(request: RequestUpdateAccountUseCase): void
}

export interface IUpdateAccountUseCaseResponse {
    success(account_updated: Account): void
    fail(err: Error): void
}

export class UpdateAccountUseCase implements IUpdateAccountUseCase {
    private repository: AccountRepository;
    private presenter: IUpdateAccountUseCaseResponse;
    
    constructor(repo: AccountRepository, presenter: IUpdateAccountUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }
    
    async execute(request: RequestUpdateAccountUseCase): Promise<void> {
        try {
            let account = await this.repository.get(request.id);

            if (account == null) {
                throw new NotFoundError('Account No Found');
            }

            if (request.title != null) {
                if (is_empty(request.title)) {
                    throw new ValidationError('Title of account is empty');
                }
                account.title = request.title;
            }


            let account_updated = await this.repository.update(account);

            this.presenter.success(account_updated);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}