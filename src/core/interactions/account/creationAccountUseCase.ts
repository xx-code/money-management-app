import { ValidationError } from '../../errors/validationError';
import { AccountRepository } from '../repositories/accountRepository';
import { CryptoService } from '../../adapter/libs';
import { is_empty } from '../../entities/verify_empty_value';

export type CreationAccountUseCaseRequest = {
    title: string;
    credit_value: number;
    credit_limit: number;
}

interface ICreationAccountUseCase {
    execute(request: CreationAccountUseCaseRequest): void;
}

export interface ICreationAccountUseCaseResponse {
    success(account_id: string): void;
    fail(err: Error): void;
}

export class CreationAccountUseCase implements ICreationAccountUseCase {
    private repository: AccountRepository;
    private crypto: CryptoService;
    private presenter: ICreationAccountUseCaseResponse;
    
    constructor(repo: AccountRepository, crypto: CryptoService, presenter: ICreationAccountUseCaseResponse) {
        this.repository = repo;
        this.crypto = crypto;
        this.presenter = presenter;
    }

    execute(request: CreationAccountUseCaseRequest): void {
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
            
            this.presenter.success(response);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}