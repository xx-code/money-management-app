import { request } from "http";
import { TransactionDisplay } from "../../entities/transaction";
import { TransactionRepository, dbFilter } from "../repositories/transactionRepository";
import { ValidationError } from "../errors/validationError";

export type Request = {
    page: number;
    size: number;
    sort_by: string|null;
    category_filter: Array<string>;
    tag_filter: Array<string>;
}

export interface IGetPaginationTransaction {
    execute(request: Request): Array<TransactionDisplay>;
}

export class GetPaginationTransaction implements IGetPaginationTransaction {
    private repository: TransactionRepository;

    constructor(repo: TransactionRepository) {
        this.repository = repo;
    }

    execute(request: Request): TransactionDisplay[] {
        try {
            if (request.page <= 0) {
                throw new ValidationError('Page request must be greather than 0');
            }

            if (request.size <= 0) {
                throw new ValidationError('Size must be greather than 0');
            }

            let filters: dbFilter = {
                tags: request.tag_filter,
                categories: request.category_filter
            };

            let results = this.repository.get_paginations(request.page, request.size, request.sort_by, filters);

            return results;
        } catch (err) {
            throw err;
        }
    }
}