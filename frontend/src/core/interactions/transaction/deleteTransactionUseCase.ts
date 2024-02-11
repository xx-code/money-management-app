import { NotFoundError } from "../../errors/notFoundError";
import { TransactionRepository } from "../repositories/transactionRepository";

interface IDeleteTransactionUseCase {
    execute(id: string): boolean;
}

export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
    private repository: TransactionRepository;
    
    constructor(repo: TransactionRepository) {
        this.repository = repo;
    }
    
    execute(id: string): boolean {
        try {
            let transaction = this.repository.get(id);
            if (transaction == null) {
                throw new NotFoundError('Transaction not found');
            }

            let response = this.repository.delete(id);
            
            return response;
        } catch(err) {
            throw err;
        }
    }
}