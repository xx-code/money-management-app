import { Type } from "../../entities/transaction";
import { ValidationError } from "../errors/validationError";
import { TransactionRepository } from "../repositories/transactionRepository";
import { Crypto } from '../utils/cryto';
import { is_empty } from "../utils/verify_empty_value";

export type RequestAddTransactionUseCase = {
    account_ref: string;
    price: number;
    category_ref: string;
    description: string;
    date: Date;
    tag_ref: string|null;
    type: Type;
}

export interface IAddTransactionUseCase {
    execute(request: RequestAddTransactionUseCase): string;
}

export class AddTransactionUseCase implements IAddTransactionUseCase {
    private repository: TransactionRepository;
    private crypto: Crypto;

    constructor(repo: TransactionRepository, crypto: Crypto) {
        this.repository = repo;
        this.crypto = crypto;
    }

    execute(request: RequestAddTransactionUseCase): string {
        try {
            let new_id = this.crypto.generate_uuid_to_string();

            if (is_empty(request.account_ref)) {
                throw new ValidationError('Account ref field is empty');
            }

            if (is_empty(request.category_ref)) {
                throw new ValidationError('Category ref field is empty');
            }

            if (request.tag_ref != null) {
               if (is_empty(request.tag_ref)) {
                    throw new ValidationError('Tag ref field is empty');
                } 
            }

            if (is_empty(request.description)) {
                throw new ValidationError('Description ref field is emtpy');
            }

            if (request.price < 0) {
                throw new ValidationError('Price must be greather to 0');
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