import { TransactionDisplay, Type } from "../../entities/transaction";
import { NotFoundError } from "../errors/notFoundError";
import { TransactionRepository } from "../repositories/transactionRepository";

export type Request = {
    id: string;
    tag_ref: string|null;
    category_ref: string|null;
    type: Type|null;
    description: string|null;
    date: Date|null;
    price: number|null;
}

interface IUpdateTransactionUseCase {
    execute(request: Request): TransactionDisplay
}

export class UpdateTransactionUseCase implements IUpdateTransactionUseCase {
    private repository: TransactionRepository;

    constructor(repo: TransactionRepository) {
        this.repository = repo;
    }

    execute(request: Request): TransactionDisplay {
        try {
            let transaction = this.repository.get(request.id);
            if (transaction != null) {
                throw new NotFoundError('Transaction not found');
            }

            let response = this.repository.update({
                id: request.id,
                tag_ref: request.tag_ref,
                category_ref: request.category_ref,
                date: request.date,
                price: request.price,
                description: request.description,
                type: request.type
            });

            return {
                id: response.id,
                tag_ref: response.tag_ref,
                category_ref: response.category_ref,
                account_ref: response.account_ref,
                date: response.date,
                price: response.price,
                description: response.description,
                type: response.type
            }
        } catch (err) {
            throw err;
        }
    }
}