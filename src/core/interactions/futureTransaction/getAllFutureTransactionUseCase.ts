import { FutureTransaction } from "@/core/entities/future_transaction";
import { FutureTransactionRepository } from "../../repositories/futureTransactionRepository";
import { reverseFormatted } from "@/core/entities/formatted";

export interface IGetAllFutureTransactionUseCase {
    execute(): void
}


export interface IGetAllFutureTransactionPresenter {
    success(future_transactions: FutureTransaction[]): void
    fail(error: Error): void
}


export class GetAllFutureTransactionUseCase implements IGetAllFutureTransactionUseCase {
    private presenter: IGetAllFutureTransactionPresenter;
    private future_transaction_repository: FutureTransactionRepository;

    constructor(presenter: IGetAllFutureTransactionPresenter, future_transaction_repository: FutureTransactionRepository) {
        this.presenter = presenter;
        this.future_transaction_repository = future_transaction_repository;
    }

    async execute(): Promise<void> {
        try {
            let transactions = await this.future_transaction_repository.get_all()

            for (let i = 0; i < transactions.length ; i++) {
                transactions[i].category.title = reverseFormatted(transactions[i].category.title);
                transactions[i].tags = transactions[i].tags.map(tag => reverseFormatted(tag));
            }

            this.presenter.success(transactions);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}