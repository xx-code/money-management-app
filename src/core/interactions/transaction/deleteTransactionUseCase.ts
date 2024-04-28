import { NotFoundError } from "../../errors/notFoundError";
import { TransactionRepository } from "../repositories/transactionRepository";

interface IDeleteTransactionUseCase {
    execute(id: string): void;
}

export interface IDeleteTransactoinUseCaseResponse {
    success(is_deleted: boolean): void;
    fail(err: Error): void
}

export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
    private repository: TransactionRepository;
    private presenter: IDeleteTransactoinUseCaseResponse;

    constructor(repo: TransactionRepository, presenter: IDeleteTransactoinUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }
    
    async execute(id: string): Promise<void> {
        try {
            let transaction = await this.repository.get(id);
            if (transaction == null) {
                throw new NotFoundError('Transaction not found');
            }

            let is_deleted = await this.repository.delete(id);
            
            this.presenter.success(is_deleted);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}