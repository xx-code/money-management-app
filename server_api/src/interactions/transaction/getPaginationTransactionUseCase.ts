import { request } from "http";
import { TransactionDisplay } from "../../entities/transaction";
import { TransactionRepository, dbFilter, dbSortBy } from "../repositories/transactionRepository";
import { ValidationError } from "../errors/validationError";
import { formatted, reverseFormatted } from "../utils/formatted";
import { is_empty } from "../utils/verify_empty_value";

export type RequestGetPagination = {
    page: number;
    size: number;
    sort_by: string|null;
    sort_sense: string|null;
    account_filter: Array<string>;
    category_filter: Array<string>;
    tag_filter: Array<string>;
}

export type Response = {
    transactions: Array<TransactionDisplay>;
    current_page: number;
    max_pages: number;
}

export interface IGetPaginationTransaction {
    execute(request: RequestGetPagination): Response;
}

export class GetPaginationTransaction implements IGetPaginationTransaction {
    private repository: TransactionRepository;

    constructor(repo: TransactionRepository) {
        this.repository = repo;
    }

    execute(request: RequestGetPagination): Response {
        try {
            if (request.page <= 0) {
                throw new ValidationError('Page request must be greather than 0');
            }

            if (request.size <= 0) {
                throw new ValidationError('Size must be greather than 0');
            }

            let filters: dbFilter = {
                accounts: request.account_filter, 
                tags: request.tag_filter,
                categories: request.category_filter
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

      
            let results = this.repository.get_paginations(request.page, request.size, sort_by, filters);

            for(let i=0; i < results.transactions.length; i++) {
                results.transactions[i].category_title = reverseFormatted(results.transactions[i].category_title);
                if (results.transactions[i].tag != null) {
                    results.transactions[i].tag = reverseFormatted(results.transactions[i].tag!);
                }
            }

            return { transactions: results.transactions, current_page: results.current_page, max_pages: results.max_page };
        } catch (err) {
            throw err;
        }
    }
}