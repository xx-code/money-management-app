import { CategoryRepository, dbCategory } from "../../interactions/repositories/categoryRepository";
import { TagRepository, dbTag } from "../../interactions/repositories/tagRepository";
import { TransactionRepository, dbFilter, dbSortBy, dbTransaction, dbTransactionPaginationResponse, dbTransactionResponse, dbTransactionUpdateRequest } from "../../interactions/repositories/transactionRepository";
import { formatted } from "../../interactions/utils/formatted";
import { PaginationError } from "../errors/PaginationError";

export class InMemoryTransactionRepository implements TransactionRepository {
    private db: Map<string, dbTransaction> = new Map();
    private category_repository: CategoryRepository;
    private tag_repository: TagRepository;

    constructor(category_repo: CategoryRepository, tag_repo: TagRepository) {
        this.category_repository = category_repo;
        this.tag_repository = tag_repo;
    }

    save(request: dbTransaction): string {
        this.db.set(request.id, {
            id: request.id,
            account_ref: request.account_ref,
            category_ref: request.category_ref,
            tag_ref: request.tag_ref,
            type: request.type,
            date: request.date,
            description: request.description,
            price: Number(request.price)
        });

        return request.id;
    }

    get(id: string): dbTransactionResponse | null {
        let response = this.db.get(id);
        if (response == undefined) {
            return null;
        }

        let category = this.get_category_info(response.category_ref);

        return {
            id: response.id,
            account_ref: response.account_ref,
            description: response.description,
            category_title: category!.title,
            category_icon: category!.icon,
            tag: response.tag_ref,
            date: response.date,
            price: Number(response.price),
            type: response.type
        }
    }

    get_paginations(page: number, size: number, sort: dbSortBy|null, filter_by: dbFilter): dbTransactionPaginationResponse {
        let transactions = Array.from(this.db.values());

        if (sort != null) {
            if (sort.sort_by == 'date') {
                if (sort.asc) {
                    transactions = transactions.sort((a, b) => a.date < b.date ? -1 : 1);
                } else {
                    if (sort.sort_by == 'date') {
                        transactions = transactions.sort((a, b) => a.date > b.date ? -1 : 1);
                    }
                }
            }
        }

        if (filter_by.accounts.length > 0) {
            transactions = transactions.filter((transaction) => filter_by.accounts.includes(transaction.account_ref));
        }

        let categories: string[] = []
        for(let cat_ref of filter_by.categories) {
            let categ = this.category_repository.get(cat_ref);
            if (categ != null ) {
                categories.push(categ.title);
            }
        }
        if (categories.length > 0) {
            transactions = transactions.filter((transaction) => categories.includes(transaction.category_ref));
        }

        let tags: string[] = []
        for(let tag_ref of filter_by.tags) {
            let tag = this.tag_repository.get(tag_ref);
            if (tag != null) {
                tags.push(tag.title);
            }
        }
        if (tags.length > 0) {
            transactions = transactions.filter((transaction) => transaction.tag_ref != null ? tags.includes(transaction.tag_ref) : true);
        }

        let max_pages = Math.ceil(transactions.length/size);

        if (max_pages < page) {
            throw new PaginationError('This page don\'t exist');
        }

        let start = ((page-1)*size);
        let end = (((page-1)*size) + size);
        
        transactions = transactions.slice(start, end);

        let responses: dbTransactionResponse[] = [];

        for(let transaction of transactions) {
            let category = this.category_repository.get(transaction.category_ref);  

            responses.push({
                id: transaction.id,
                account_ref: transaction.account_ref,
                tag: transaction.tag_ref,
                category_title: category!.title,
                category_icon: category!.icon,
                date: transaction.date,
                description: transaction.description,
                price: Number(transaction.price),
                type: transaction.type
            });
        }

        return { transactions: responses, current_page: page, max_page: max_pages };
    }

    delete(id: string): boolean {
        let response = this.db.delete(id);

        return response;
    }

    update(request: dbTransactionUpdateRequest): dbTransactionResponse {
        let transaction = this.db.get(request.id);

        if (request.category_ref != null) {
            transaction!.category_ref = request.category_ref; 
        }

        if (request.date != null) {
            transaction!.date = request.date;
        }

        if (request.price != null) {
            transaction!.price = request.price;
        }

        if (request.type != null) {
            transaction!.type = request.type;
        }

        if (request.tag_ref != null) {
            transaction!.tag_ref = request.tag_ref;
        }

        if (request.description != null) {
            transaction!.description = request.description;
        }

        this.db = this.db.set(request.id, transaction!);
        let category = this.get_category_info(this.db.get(request.id)!.category_ref);

        return {
            id: request.id,
            account_ref: this.db.get(request.id)!.account_ref,
            category_icon: category!.icon,
            category_title: category!.title,
            date: this.db.get(request.id)!.date,
            description: this.db.get(request.id)!.description,
            price: Number(this.db.get(request.id)!.price),
            tag: this.db.get(request.id)!.tag_ref,
            type: this.db.get(request.id)!.type
        }
    }

    get_balance(filter_by: dbFilter): number {
        let transactions = Array.from(this.db.values());

        if (filter_by.accounts.length > 0) {
            transactions = transactions.filter((transaction) => filter_by.accounts.includes(transaction.account_ref));
        }

        let categories: string[] = []
        for(let cat_ref of filter_by.categories) {
            let categ = this.category_repository.get(cat_ref);
            if (categ != null ) {
                categories.push(categ.title);
            }
        }
        if (categories.length > 0) {
            transactions = transactions.filter((transaction) => categories.includes(transaction.category_ref));
        }

        let tags: string[] = []
        for(let tag_ref of filter_by.tags) {
            let tag = this.tag_repository.get(tag_ref);
            if (tag != null) {
                tags.push(tag.title);
            }
        }
        if (tags.length > 0) {
            transactions = transactions.filter((transaction) => transaction.tag_ref != null ? tags.includes(transaction.tag_ref) : true);
        }

        let balance_credit = 0;
        for(let trans of transactions) {
            balance_credit += formatted(trans.type) == 'CREDIT' ? - Number(trans.price) : Number(trans.price);
        }

        return balance_credit;
    }

    private get_category_info(id: string): dbCategory | null {
        return this.category_repository.get(id);
    }

    private get_tag_info(id: string): dbTag | null {
        return this.tag_repository.get(id);
    }
}