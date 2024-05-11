import { Transaction, TransactionType, is_Transaction_type } from "../../entities/transaction";
import { TransactionRepository, dbFilter, dbSortBy } from "../repositories/transactionRepository";
import { RecordRepository } from "../repositories/recordRepository";
import { AccountRepository } from "../repositories/accountRepository";
import { TagRepository } from "../repositories/tagRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { ValidationError } from "../../errors/validationError";
import { formatted, reverseFormatted } from "../../entities/formatted";
import { is_empty } from "../../entities/verify_empty_value";
import DateParser from "@/core/entities/date_parser";

export type RequestGetPagination = {
    page: number;
    size: number;
    sort_by: string|null;
    sort_sense: string|null;
    account_filter: Array<string>;
    category_filter: Array<string>;
    tag_filter: Array<string>;
    date_start: DateParser|null;
    date_end: DateParser|null;
    type: string | null | undefined;
    price: number | undefined;
}

export type TransactionResponse = {
    transactions: Transaction[];
    current_page: number;
    max_pages: number;
}

export interface IGetPaginationTransaction {
    execute(request: RequestGetPagination): void;
}

export interface IGetPaginationTransactionResponse {
    success(response: TransactionResponse): void;
    fail(err: Error): void;
}

export class GetPaginationTransaction implements IGetPaginationTransaction {
    private transaction_repository: TransactionRepository;
    private account_repository: AccountRepository;
    private category_repository: CategoryRepository;
    private tag_repository: TagRepository;
    private record_repository: RecordRepository;
    private presenter: IGetPaginationTransactionResponse;

    constructor(transaction_repo: TransactionRepository, account_repo: AccountRepository, category_repo: CategoryRepository, tag_repo: TagRepository, record_repo: RecordRepository, presenter: IGetPaginationTransactionResponse) {
        this.transaction_repository = transaction_repo;
        this.account_repository = account_repo;
        this.category_repository = category_repo;
        this.tag_repository = tag_repo;
        this.record_repository = record_repo;
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

                if (account == null) {
                    throw new ValidationError('Account ' + request.account_filter[i] + ' in filter not exist');
                }

                accounts_to_filter.push(account!.id)
            }

            for (let i = 0; i < request.category_filter.length; i++) {
                let category = await this.category_repository.get(request.category_filter[i]);

                if (category == null) {
                    throw new ValidationError('Category ' + request.category_filter[i] + ' in filter not exist');
                }

                categories_to_filter.push(category!.id)
            }

            for (let i = 0; i < request.tag_filter.length; i++) {
                let tag = await this.tag_repository.get(request.tag_filter[i]);

                if (tag == null) {
                    throw new ValidationError('Tag ' + request.tag_filter[i] + ' in filter not exist');
                }

                tags_to_filter.push(tag!)
            }

            if ((request.date_start !== null && request.date_start !== undefined) && ((request.date_end !== null && request.date_end !== undefined))) {
                if (request.date_end < request.date_start) {
                    throw new ValidationError('Date start must be less than date end');
                }
            }

            let type = null;
            if (request.type !== null && request.type !== undefined) {
                if (!is_Transaction_type(request.type)) {
                    throw new ValidationError('Type must be Debit or Credit')
                }
                type = TransactionType[request.type];
            }

            let price = null;
            if (request.price !== null && request.price !== undefined) {
                if (request.price < 0) {
                    throw new ValidationError('Price must be greather than 0')
                }
                price = request.price;
            }
 
            let filters: dbFilter = {
                accounts: accounts_to_filter, 
                tags: tags_to_filter,
                categories: categories_to_filter,
                start_date: request.date_start,
                end_date: request.date_end,
                type: type,
                price: price
            };

            let sort_by: dbSortBy|null = null;

            request.sort_by = 'date';
            request.sort_sense = 'desc'

            if (request.sort_by != null) {
                if (is_empty(request.sort_by)) {
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
      
            let response = await this.transaction_repository.get_paginations(request.page, request.size, sort_by, filters);

            for (let i = 0; i < response.transactions.length ; i++) {
                response.transactions[i].category.title = reverseFormatted(response.transactions[i].category.title);
                response.transactions[i].tags = response.transactions[i].tags.map(tag => reverseFormatted(tag));
            }

            this.presenter.success({ transactions: response.transactions, current_page: response.current_page, max_pages: response.max_page });
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}