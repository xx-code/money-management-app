import { AccountRepository } from "../../repositories/accountRepository";
import { NotFoundError } from "../../errors/notFoundError";
import { isEmpty } from "@/core/domains/helpers";
import ValidationError from "@/core/errors/validationError";

export type RequestUpdateAccountUseCase = {
    id: string;
    title: string|null;
}

export type AccountResponse = {
    account_id: string
    title: string
}

interface IUpdateAccountUseCase {
    execute(request: RequestUpdateAccountUseCase): void
}

export interface IUpdateAccountUseCaseResponse {
    success(account_updated: AccountResponse): void
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
                if (isEmpty(request.title)) {
                    throw new ValidationError('Title of account is empty');
                }
                account.title = request.title;
            }


            let account_updated = await this.repository.update(account);

            this.presenter.success({account_id: account_updated.id, title: account_updated.title});
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}