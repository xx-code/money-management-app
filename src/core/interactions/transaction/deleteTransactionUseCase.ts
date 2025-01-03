import { NotFoundError } from "../../errors/notFoundError";
import { RecordRepository } from "../../repositories/recordRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";

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
    private record_repo: RecordRepository;

    constructor(repo: TransactionRepository, record_repo: RecordRepository, presenter: IDeleteTransactoinUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
        this.record_repo = record_repo;
    }
    
    async execute(id: string): Promise<void> {
        try {
            let transaction = await this.repository.get(id);
            if (transaction == null) {
                throw new NotFoundError('Transaction not found');
            }

            let is_deleted_record = await this.record_repo.delete(transaction.record_ref);

            if (is_deleted_record === false) {
                throw new NotFoundError('Error while deleting record');
            }

            let is_deleted = await this.repository.delete(id);
            
            this.presenter.success(is_deleted);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}