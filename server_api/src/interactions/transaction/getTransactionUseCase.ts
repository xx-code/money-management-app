import { TransactionDisplay } from "../../entities/transaction";
import { NotFoundError } from "../errors/notFoundError";
import { TransactionRepository } from "../repositories/transactionRepository";
import { reverseFormatted } from "../utils/formatted";

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

            let responseTag = transaction.tag;
            if (transaction.tag != null) {
                responseTag = reverseFormatted(transaction.tag!)
            }
            return {
                id: transaction.id,
                account_ref: transaction.account_ref, 
                tag: responseTag,
                category_title: reverseFormatted(transaction.category_title),
                category_icon: transaction.category_icon,
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