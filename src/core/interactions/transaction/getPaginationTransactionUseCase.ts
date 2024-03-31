import { Transaction } from "../../entities/transaction";
import { TransactionRepository, dbFilter, dbSortBy } from "../repositories/transactionRepository";
import { RecordRepository } from "../repositories/recordRepository";
import { AccountRepository } from "../repositories/accountRepository";
import { TagRepository } from "../repositories/tagRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { ValidationError } from "../../errors/validationError";
import { formatted, reverseFormatted } from "../../entities/formatted";
import { is_empty } from "../../entities/verify_empty_value";

export type RequestGetPagination = {
    page: number;
    size: number;
    sort_by: string|null;
    sort_sense: string|null;
    account_filter: Array<string>;
    category_filter: Array<string>;
    tag_filter: Array<string>;
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

                accounts_to_filter.push(account!)
            }

            for (let i = 0; i < request.category_filter.length; i++) {
                let category = await this.category_repository.get(request.category_filter[i]);

                if (category == null) {
                    throw new ValidationError('Category ' + request.category_filter[i] + ' in filter not exist');
                }

                categories_to_filter.push(category!)
            }

            for (let i = 0; i < request.tag_filter.length; i++) {
                let tag = this.tag_repository.get(request.tag_filter[i]);

                if (tag == null) {
                    throw new ValidationError('Tag ' + request.tag_filter[i] + ' in filter not exist');
                }

                tags_to_filter.push(tag!)
            }
 
            let filters: dbFilter = {
                accounts: accounts_to_filter, 
                tags: tags_to_filter,
                categories: categories_to_filter
            };

            let sort_by: dbSortBy|null = null;

            if (request.sort_by != null) {
                if (is_empty(request.sort_by)) {
                   throw new ValidationError('Sort by is empty field');
                }

                if (request.sort_sense == null) {
                    throw new ValidationError('Sort sense field is empty');
                } else {
                    if (formatted(request.sort_sense) != 'ASC' || formatted(request.sort_sense) != 'DESC' ) {
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
      
            let response = this.transaction_repository.get_paginations(request.page, request.size, sort_by, filters);

            this.presenter.success({ transactions: response.transactions, current_page: response.current_page, max_pages: response.max_page });
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}