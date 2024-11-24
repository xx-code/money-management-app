import { ValidationError } from "@/core/errors/validationError"
import { FutureTransactionRepository } from "../../repositories/futureTransactionRepository"
import { RecordRepository } from "../../repositories/recordRepository"
import { NotFoundError } from "@/core/errors/notFoundError"

export interface IDeleteFutureTransactionUseCase {
    execute(id: string): void
}

export interface IArchiveFutureTransactionUseCase {
    execute(id: string): void
}

export interface IDeleteFutureTransactionPresenter {
    success(is_delete: boolean): void
    fail(err: Error): void
}


export class DeleteFutureTransactionUseCase implements IDeleteFutureTransactionUseCase {
    private future_transaction_repository: FutureTransactionRepository;
    private presenter: IDeleteFutureTransactionPresenter;
    private record_repository: RecordRepository

    constructor(future_transaction_repo: FutureTransactionRepository, record_repo: RecordRepository, presenter: IDeleteFutureTransactionPresenter) {
        this.future_transaction_repository = future_transaction_repo;
        this.presenter = presenter;
        this.record_repository = record_repo
    }

    async execute(id: string): Promise<void> {
        try {
            
            let future_transaction = await this.future_transaction_repository.get(id)
    
            if (future_transaction === null) {
                throw new ValidationError('This future transaction don\'t exist');
            }

            let is_deleted_record = await this.record_repository.delete(future_transaction.record.id);

            if (is_deleted_record === false) {
                throw new NotFoundError('Error while deleting record');
            }

            let is_deleted = await this.future_transaction_repository.delete(id);

            this.presenter.success(is_deleted);
        } catch(err) {
            this.presenter.fail(err as Error)
        }
    }
}


export class ArchiveFutureTransactionUseCase implements IDeleteFutureTransactionUseCase {
    private future_transaction_repository: FutureTransactionRepository;
    private presenter: IDeleteFutureTransactionPresenter;

    constructor(future_transaction_repo: FutureTransactionRepository, presenter: IDeleteFutureTransactionPresenter) {
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