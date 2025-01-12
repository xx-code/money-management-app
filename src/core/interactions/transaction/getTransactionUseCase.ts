import { CategoryRepository } from "@/core/repositories/categoryRepository";
import { NotFoundError } from "../../errors/notFoundError";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { TagRepository } from "@/core/repositories/tagRepository";
import { RecordRepository } from "@/core/repositories/recordRepository";

export interface IGetTransactionUseCase {
    execute(id: string): void;   
}

export type TransactionCategoryResponse = {
    id: string
    title: string,
    icon: string,
    color: string|null
}

export type TransactionTagResponse = {
    id: string
    value: string
    color: string|null
}

export type TransactionResponse = {
    transaction_id: string
    account_id: string
    amount: number
    date: string
    description: string
    type: string
    category: TransactionCategoryResponse
    tags: TransactionTagResponse[]
}

export interface IGetTransactionUseCaseResponse {
    success(transaction: TransactionResponse): void;
    fail(err: Error): void;
}

export interface IGetTransactionAdapter {
    transaction_repository: TransactionRepository
    category_repository: CategoryRepository
    tag_repository: TagRepository
    record_repository: RecordRepository
}

export class GetTransactionUseCase implements IGetTransactionUseCase {
    private transaction_repository: TransactionRepository;
    private category_repository: CategoryRepository;
    private tag_repository: TagRepository;
    private record_repository: RecordRepository; 
    private presenter: IGetTransactionUseCaseResponse;

    constructor(adapter: IGetTransactionAdapter, presenter: IGetTransactionUseCaseResponse) {
        this.transaction_repository = adapter.transaction_repository
        this.category_repository = adapter.category_repository
        this.tag_repository = adapter.tag_repository
        this.record_repository = adapter.record_repository
        this.presenter = presenter;
    }

    async execute(id: string): Promise<void> {
        try {
            let transaction = await this.transaction_repository.get(id);

            if (transaction == null) {
                throw new NotFoundError('Transaction not found');
            }

            let record = await this.record_repository.get(transaction.record_ref)

            if (record === null)
                throw new NotFoundError('Error not found record in transaction')

            let category = await this.category_repository.get(transaction.category_ref)
            
            if (category === null)
                throw new NotFoundError('No category found in transaction')
            
            let tags: TransactionTagResponse[] = []
            for(let tag_ref of transaction.getTags()) {
                let tag = await this.tag_repository.get(tag_ref)
                if (tag === null)
                    throw new NotFoundError('No tag found in transaction')

                tags.push({
                    id: tag.id,
                    value: tag.getValue(),
                    color: tag.color
                })
            }

            let response: TransactionResponse = {
                account_id: transaction.account_ref,
                transaction_id: transaction.id,
                amount: record.amount.getAmount(),
                date: record.date.toString(),
                description: record.description,
                type: record.type,
                category: {
                    id: category.id,
                    title: category.getTitle(),
                    icon: category.icon,
                    color: category.color
                },
                tags: tags
            }

            this.presenter.success(response);
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}