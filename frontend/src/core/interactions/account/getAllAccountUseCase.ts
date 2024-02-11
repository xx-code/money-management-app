import { AccountDisplay } from "../../entities/account";
import { AccountRepository } from "../repositories/accountRepository";

interface IGetAllAccountUseCase {
    execute(): Array<AccountDisplay>
}

export class GetAllAccountUseCase implements IGetAllAccountUseCase{
    private repository: AccountRepository;

    constructor(repo: AccountRepository) {
        this.repository = repo;
    }

    execute(): AccountDisplay[] {
        try {
            let account = this.repository.get_all();

            return account;
        } catch(err) {
            throw err
        } 
    }
}