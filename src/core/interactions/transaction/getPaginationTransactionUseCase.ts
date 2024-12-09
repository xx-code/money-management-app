import { TransactionRepository, TransactionFilter, SortBy } from "../../repositories/transactionRepository";
import { RecordRepository } from "../../repositories/recordRepository";
import { AccountRepository } from "../../repositories/accountRepository";
import { TagRepository } from "../../repositories/tagRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { Transaction } from "@/core/domains/entities/transaction";
import ValidationError from "@/core/errors/validationError";
import { DateParser, formatted, isEmpty } from "@/core/domains/helpers";
import { mapperTransactionType } from "@/core/mappers/transaction";
import { Category } from "@/core/domains/entities/category";

export type RequestGetPagination = {
    page: number;
    size: number;
    sort_by: string|null;
    sort_sense: string|null;
    account_filter: Array<string>;
    category_filter: Array<string>;
    tag_filter: Array<string>;
    date_start: string|null;
    date_end: string|null;
    type: string | null | undefined;
    price: number | undefined;
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
    amount: number
    date: string
    description: string
    type: string
    category: TransactionCategoryResponse
    tags: TransactionTagResponse[]
}

export type TransactionPaginationResponse = {
    transactions: TransactionResponse[];
    max_pages: number;
}

export interface IGetPaginationTransaction {
    execute(request: RequestGetPagination): void;
}

export interface IGetPaginationTransactionResponse {
    success(response: TransactionPaginationResponse): void;
    fail(err: Error): void;
}

export interface IGetPaginationTransactionAdapter {
    transaction_repository: TransactionRepository
    account_repository: AccountRepository
    category_repository: CategoryRepository
    tag_repository: TagRepository
    record_repository: RecordRepository
}

export class GetPaginationTransaction implements IGetPaginationTransaction {
    private transaction_repository: TransactionRepository;
    private account_repository: AccountRepository;
    private category_repository: CategoryRepository;
    private tag_repository: TagRepository;
    private record_repository: RecordRepository;
    private presenter: IGetPaginationTransactionResponse;

    constructor(adapter: IGetPaginationTransactionAdapter, presenter: IGetPaginationTransactionResponse) {
        this.transaction_repository = adapter.transaction_repository;
        this.account_repository = adapter.account_repository;
        this.category_repository = adapter.category_repository;
        this.tag_repository = adapter.tag_repository;
        this.record_repository = adapter.record_repository;
        this.presenter = presenter;
    }

    async execute(request: RequestGetPagination): Promise<void> {
        try {
            if (request.page <= 0) {
                throw new ValidationError('Page request must be greather than 0');
            }

            if (request.size <= 0) {
                throw new ValidationError('Size must be greather than 0');
            }
            
            let accounts_to_filter = []
            let categories_to_filter = []
            let tags_to_filter = []
            
            for (let i = 0; i < request.account_filter.length; i++) {
                let account = await this.account_repository.get(request.account_filter[i]);

                if (account === null) {
                    throw new ValidationError('Account ' + request.account_filter[i] + ' in filter not exist');
                }

                accounts_to_filter.push(account!.id)
            }

            for (let i = 0; i < request.category_filter.length; i++) {
                let category = await this.category_repository.get(request.category_filter[i]);

                if (category === null) {
                    throw new ValidationError('Category ' + request.category_filter[i] + ' in filter not exist');
                }

                categories_to_filter.push(category.id)
            }

            for (let i = 0; i < request.tag_filter.length; i++) {
                let tag = await this.tag_repository.get(request.tag_filter[i]);

                if (tag === null) {
                    throw new ValidationError('Tag ' + request.tag_filter[i] + ' in filter not exist');
                }

                tags_to_filter.push(tag.id)
            }

            if (!isEmpty(request.date_start) && !isEmpty(request.date_end)) {
                if (DateParser.fromString(request.date_end!).compare(DateParser.fromString(request.date_start!)) < 0) {
                    throw new ValidationError('Date start must be less than date end');
                }
            }

            let date_start = null
            if (!isEmpty(request.date_end))
                date_start = DateParser.fromString(request.date_start!)
            
            let date_end = null
            if (!isEmpty(request.date_end))
                date_end = DateParser.fromString(request.date_end!) 

            let type = null;
            if (!isEmpty(request.type))
                type = mapperTransactionType(request.type!)

            let price = null;
            if (request.price !== null && request.price !== undefined) {
                if (request.price < 0) {
                    throw new ValidationError('Price must be greather than 0')
                }
                price = request.price;
            }
 
            let filters: TransactionFilter = {
                accounts: accounts_to_filter, 
                tags: tags_to_filter,
                categories: categories_to_filter,
                start_date: date_start?.toString(),
                end_date: date_end?.toString(),
                type: type,
                price: price
            };

            let sort_by: SortBy|null = null;

            request.sort_by = 'date';
            request.sort_sense = 'desc'

            if (request.sort_by !== null) {
                if (isEmpty(request.sort_by)) {
                   throw new ValidationError('Sort by is empty field');
                }

                if (request.sort_sense == null) {
                    throw new ValidationError('Sort sense field is empty');
                } else {
                    if (formatted(request.sort_sense) != 'ASC' && formatted(request.sort_sense) != 'DESC' ) {
                        throw new ValidationError('The sort sense must be \'asc\' or \'desc\'');
                    }
                }

                let asc = false;
                if (formatted(request.sort_sense) == 'asc') {
                    asc = true;
                }
                sort_by = {
                    sort_by: request.sort_by,
                    asc: asc
                }
            }
      
            let response = await this.transaction_repository.getPaginations(request.page, request.size, sort_by, filters);

            let transactions: TransactionResponse[] = []
            for (let i = 0; i < response.transactions.length ; i++) {
                let transaction = response.transactions[i]
                let category = await this.category_repository.get(transaction.category_ref)
                let record = await this.record_repository.get(transaction.record_ref)

                if (category === null || record === null ) {
                    throw new ValidationError("Error with categories")
                }

                let category_res: TransactionCategoryResponse = {
                    id: category.id,
                    title: category.getTitle(),
                    color: category.color,
                    icon: category.icon
                }

                let tags_res: TransactionTagResponse[] = []
                for(let tag_ref of transaction.getTags()) {
                    let tag = await this.tag_repository.get(tag_ref)
                    if (!tag) {
                        throw new ValidationError('Error while get transaction in tag retreived')
                    }

                    tags_res.push({
                        id: tag.id,
                        value: tag.getValue(),
                        color: tag.color
                    })
                }

                transactions.push({
                    transaction_id: transaction.id,
                    amount: record.amount.getAmount(),
                    category: category_res,
                    date: record.date.toString(),
                    tags: tags_res,
                    description: record.description,
                    type: record.type,
                })
            }

            this.presenter.success({ transactions: transactions, max_pages: response.max_page });
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}