import { request } from "http";
import { TransactionDisplay } from "../../entities/transaction";
import { TransactionRepository, dbFilter } from "../repositories/transactionRepository";
import { ValidationError } from "../errors/validationError";

export type Request = {
    page: number;
    size: number;
    sort_by: string|null;
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
    execute(request: Request): Response;
}

export class GetPaginationTransaction implements IGetPaginationTransaction {
    private repository: TransactionRepository;

    constructor(repo: TransactionRepository) {
        this.repository = repo;
    }

    execute(request: Request): Response {
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

            let results = this.repository.get_paginations(request.page, request.size, request.sort_by, filters);

            return { transactions: results.transactions, current_page: results.current_page, max_pages: results.max_page };
        } catch (err) {
            throw err;
        }
    }
}