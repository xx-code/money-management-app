import { NotFoundError } from "../../errors/notFoundError";
import { TransactionRepository } from "../repositories/transactionRepository";

interface IDeleteTransactionUseCase {
    execute(id: string): void;
}

export interface IDeleteTransactoinUseCaseResponse {
    success(id: string): void;
    fail(err: Error): void
}

export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
    private repository: TransactionRepository;
    private presenter: IDeleteTransactoinUseCaseResponse;

    constructor(repo: TransactionRepository, presenter: IDeleteTransactoinUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }
    
    execute(id: string): void {
        try {
            let transaction = this.repository.get(id);
            if (transaction == null) {
                throw new NotFoundError('Transaction not found');
            }

            this.repository.delete(id);
            
            this.presenter.success(id)
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}