import { ValidationError } from '../errors/validationError';
import { AccountRepository } from '../repositories/accountRepository';
import { Crypto } from '../utils/cryto';
import { is_empty } from '../utils/verify_empty_value';

export type Request = {
    title: string;
    credit_value: number;
    credit_limit: number;
}

interface ICreationAccountUseCase {
    execute(request: Request): string;
}

export class CreationAccountUseCase implements ICreationAccountUseCase {
    private repository: AccountRepository;
    private crypto: Crypto;
    
    constructor(repo: AccountRepository, crypto: Crypto) {
        this.repository = repo;
        this.crypto = crypto;
    }

    execute(request: Request): string {
        try {
            let id = this.crypto.generate_uuid_to_string();

            if (is_empty(request.title)) {
                throw new ValidationError('Title of account is empty');
            }

            if (this.repository.exist(request.title)) {
                throw new ValidationError('Account name already exist');
            }

            if (request.credit_value < 0) {
                throw new ValidationError('Credit value must be greater than 0');
            } 

            if (request.credit_limit < 0) {
                throw new ValidationError('Credit limit must be greater than 0');
            }

            let response = this.repository.save({
                id: id,
                title: request.title,
                credit_limit: request.credit_limit,
                credit_value: request.credit_value
            });
            
            return response;
        } catch (err) {
            throw err;
        }
    }
}