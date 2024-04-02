import { Transaction } from "../../entities/transaction";
import { NotFoundError } from "../../errors/notFoundError";
import { TransactionRepository, dbFilter, dbSortBy } from "../repositories/transactionRepository";

export interface IGetTransactionUseCase {
    execute(id: string): void;   
}

export interface IGetTransactionUseCaseResponse {
    success(transaction: Transaction): void;
    fail(err: Error): void;
}

export class GetTransactionUseCase implements IGetTransactionUseCase {
    private transaction_repository: TransactionRepository;
    private presenter: IGetTransactionUseCaseResponse;

    constructor(repo: TransactionRepository, presenter: IGetTransactionUseCaseResponse) {
        this.transaction_repository = repo;
        this.presenter = presenter;
    }

    async execute(id: string): Promise<void> {
        try {
            let transaction = await this.transaction_repository.get(id);

            if (transaction == null) {
                throw new NotFoundError('Transaction not found');
            }
            
            this.presenter.success(transaction);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}