import { NotFoundError } from "../../errors/notFoundError";
import { AccountRepository } from "../repositories/accountRepository";

interface IDeleteAccountUseCase {
    execute(id: string): boolean;
}

export class DeleteAccountUseCase implements IDeleteAccountUseCase {
    private repository: AccountRepository; 

    constructor(repo: AccountRepository) {
        this.repository = repo;
    }

    execute(id: string): boolean {
        try {
            if (this.repository.get(id) == null) {
                throw new NotFoundError('Account Not Found');
            }

            return this.repository.delete(id);
        } catch(err) {
            throw err;
        }
    }
}