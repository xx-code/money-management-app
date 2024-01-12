import { TransactionDisplay } from "../../entities/transaction";
import { NotFoundError } from "../errors/notFoundError";
import { TransactionRepository } from "../repositories/transactionRepository";

export interface IGetTransactionUseCase {
    execute(id: string): TransactionDisplay;   
}

export class GetTransactionUseCase implements IGetTransactionUseCase {
    private repository: TransactionRepository;

    constructor(repo: TransactionRepository) {
        this.repository = repo;
    }

    execute(id: string): TransactionDisplay {
        try {
            let transaction = this.repository.get(id);

            if (transaction == null) {
                throw new NotFoundError('Transaction not found');
            }

            return {
                id: transaction.id,
                account_ref: transaction.account_ref, 
                tag_ref: transaction.tag_ref,
                category_ref: transaction.category_ref,
                date: transaction.date,
                description: transaction.description,
                price: transaction.price,
                type: transaction.type
            }
        } catch (err) {
            throw err;
        }
    }
}