import { ValidationError } from "@/core/errors/validationError"
import { FutureTransactionRepository } from "../repositories/futureTransactionRepository"

export interface IDeleteFutureTransactionUseCase {
    execute(id: string): void
}

export interface IArchiveFutureTransactionUseCase {
    execute(id: string): void
}

export interface DeleteFutureTransactionPresenter {
    success(is_delete: boolean): void
    fail(err: Error): void
}


export class DeleteFutureTransaction implements IDeleteFutureTransactionUseCase {
    private future_transaction_repository: FutureTransactionRepository;
    private presenter: DeleteFutureTransactionPresenter;

    constructor(future_transaction_repo: FutureTransactionRepository, presenter: DeleteFutureTransactionPresenter) {
        this.future_transaction_repository = future_transaction_repo;
        this.presenter = presenter;
    }

    async execute(id: string): Promise<void> {
        try {

            if (await this.future_transaction_repository.get(id) === null) {
                throw new ValidationError('This future transaction don\'t exist');
            }

            let is_deleted = await this.future_transaction_repository.delete(id);

            this.presenter.success(is_deleted);
        } catch(err) {
            this.presenter.fail(err as Error)
        }
    }
}


export class ArchiveFutureTransaction implements IDeleteFutureTransactionUseCase {
    private future_transaction_repository: FutureTransactionRepository;
    private presenter: DeleteFutureTransactionPresenter;

    constructor(future_transaction_repo: FutureTransactionRepository, presenter: DeleteFutureTransactionPresenter) {
        this.future_transaction_repository = future_transaction_repo;
        this.presenter = presenter;
    }

    async execute(id: string): Promise<void> {
        try {

            if (this.future_transaction_repository.get(id) === null) {
                throw new ValidationError('This future transaction don\'t exist')
            }

            let is_archived = await this.future_transaction_repository.archive(id);

            this.presenter.success(is_archived);
        } catch(err) {
            this.presenter.fail(err as Error)
        }
    }
}