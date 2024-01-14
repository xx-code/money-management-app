import { Type } from "../../entities/transaction";
import { ValidationError } from "../errors/validationError";
import { TransactionRepository } from "../repositories/transactionRepository";
import { Crypto } from '../utils/cryto';

export type Request = {
    account_ref: string;
    price: number;
    category_ref: string;
    description: string;
    date: Date;
    tag_ref: string|null;
    type: Type;
}

export interface IAddTransactionUseCase {
    execute(request: Request): string;
}

export class AddTransactionUseCase implements IAddTransactionUseCase {
    private repository: TransactionRepository;
    private crypto: Crypto;

    constructor(repo: TransactionRepository, crypto: Crypto) {
        this.repository = repo;
        this.crypto = crypto;
    }

    execute(request: Request): string {
        try {
            let new_id = this.crypto.generate_uuid_to_string();

            if (request.account_ref.replace(' ', '').length == 0) {
                throw new ValidationError('Account ref field is empty');
            }

            if (request.category_ref.replace(' ', '').length == 0) {
                throw new ValidationError('Category ref field is empty');
            }

            if (request.description.replace(' ', '').length == 0) {
                throw new ValidationError('Description ref field is emtpy');
            }

            if (request.price < 0) {
                throw new ValidationError('Price must be greather or equal to 0');
            }
            
            let response = this.repository.save({
                id: new_id,
                account_ref: request.account_ref,
                category_ref: request.category_ref,
                tag_ref: request.tag_ref,
                description: request.description,
                price: request.price,
                date: request.date,
                type: request.type
            });

            return response;
        } catch (err) {
            throw err;
        }
    }
}