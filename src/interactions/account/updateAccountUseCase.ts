import { AccountRepository } from "../repositories/accountRepository";
import { AccountDisplay } from "../../entities/account";
import { NotFoundError } from "../errors/notFoundError";

type Request = {
    id: string;
    title: string|null;
    credit_value: number|null;
    credit_limit: number|null;
    balance: number|null;
}

interface IUpdateAccountFactoryUseCase {
    execute(request: Request): AccountDisplay
}


export class UpdateAccountUseCase implements IUpdateAccountFactoryUseCase {
    private repository: AccountRepository;
    
    constructor(repo: AccountRepository) {
        this.repository = repo;
    }

    execute(request: Request): AccountDisplay {
        try {
            let account = this.repository.get(request.id);

            if (account == null) {
                throw new NotFoundError('Account No Found');
            }

            let response = this.repository.updated({
                id: request.id,
                title: request.title,
                credit_limit: request.credit_limit,
                credit_value: request.credit_value
            });

            account = <AccountDisplay> {
                id: response.id,
                title: response.title,
                credit_limit: response.credit_limit,
                credit_value: response.credit_value,
                balance: response.balance
            };

            return <AccountDisplay>account;
        } catch(err) {
            throw err;
        }
    }
}