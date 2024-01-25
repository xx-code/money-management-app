import { AccountDisplay } from "../../entities/account";
import { NotFoundError } from "../errors/notFoundError";
import { AccountRepository } from "../repositories/accountRepository";

interface IGetAccountUseCase {    
    execute(id: string): AccountDisplay;
}

export class GetAccountUseCase implements IGetAccountUseCase {
    private repository: AccountRepository;

    constructor(repo: AccountRepository) {
        this.repository = repo;
    }
    
    execute(id: string): AccountDisplay {
        try {
            let account = this.repository.get(id);

            if (account == null) {
                throw new NotFoundError('Account Not Found');
            }

            return <AccountDisplay>account;
        } catch(err) {
            throw err;
        }
    }
}