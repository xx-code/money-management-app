import { AccountRepository } from "../repositories/accountRepository";
import { AccountDisplay } from "../../entities/account";
import { NotFoundError } from "../errors/notFoundError";
import { ValidationError } from "../errors/validationError";
import { is_empty } from '../utils/verify_empty_value';

export type RequestUpdateAccountUseCase = {
    id: string;
    title: string|null;
    credit_value: number|null;
    credit_limit: number|null;
}

interface IUpdateAccountUseCase {
    execute(request: RequestUpdateAccountUseCase): AccountDisplay
}


export class UpdateAccountUseCase implements IUpdateAccountUseCase {
    private repository: AccountRepository;
    
    constructor(repo: AccountRepository) {
        this.repository = repo;
    }

    execute(request: RequestUpdateAccountUseCase): AccountDisplay {
        try {
            let account = this.repository.get(request.id);

            if (account == null) {
                throw new NotFoundError('Account No Found');
            }

            if (request.title != null) {
                if (is_empty(request.title)) {
                    throw new ValidationError('Title of account is empty');
                }
            }

            if (request.credit_limit != null) {
                if (request.credit_limit < 0) {
                    throw new ValidationError('Credit limit must be greater than 0');
                }
            } 

            if (request.credit_value != null) {
                if (request.credit_value < 0) {
                    throw new ValidationError('Credit value must be greater than 0')
                }
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