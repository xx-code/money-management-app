import { FutureTransaction } from "@/core/entities/future_transaction";
import { FutureTransactionRepository } from "../repositories/futureTransactionRepository";

export interface IGetAllFutureTransactionUseCase {
    execute(): void
}


export interface GetAllFutureTransactionPresenter {
    success(future_transactions: FutureTransaction[]): void
    fail(error: Error): void
}


export class GetAllFutureTransactionUseCase implements IGetAllFutureTransactionUseCase {
    private presenter: GetAllFutureTransactionPresenter;
    private future_transaction_repository: FutureTransactionRepository;

    constructor(presenter: GetAllFutureTransactionPresenter, future_transaction_repository: FutureTransactionRepository) {
        this.presenter = presenter;
        this.future_transaction_repository = future_transaction_repository;
    }

    async execute(): Promise<void> {
        try {
            let response = await this.future_transaction_repository.get_all()
            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}