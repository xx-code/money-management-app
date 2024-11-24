import { dbFilter, dbSortBy, TransactionRepository } from "../../repositories/transactionRepository";
import { FREEZE_CATEGORY_ID } from "./addFreezeBalanceUseCase";
import DateParser from "@/core/entities/date_parser";

export interface IAutoDeleteFreezeBalanceUseCase {
    execute(): void
}

export interface IAutoDeleteFreezeBalancePresenter {
    success(message: string): void;
    fail(err: Error): void;
}

export class AutoDeleteFreezeBalanceUseCase  implements IAutoDeleteFreezeBalanceUseCase {
    private transaction_repository: TransactionRepository;
    private presenter: IAutoDeleteFreezeBalancePresenter;

    constructor(transaction_repo: TransactionRepository, presenter: IAutoDeleteFreezeBalancePresenter) {
        this.transaction_repository = transaction_repo;
        this.presenter = presenter;
    }

    async execute(): Promise<void> {
        try {

            let categories_to_filter = [FREEZE_CATEGORY_ID]

        
            let filters: dbFilter = {
                accounts: [], 
                tags: [],
                categories: categories_to_filter,
                start_date: null,
                end_date: null,
                type: null,
                price: null
            };

            let sort_by: dbSortBy|null = null;
      
            let response = await this.transaction_repository.get_paginations(-1, 1, sort_by, filters);

            for (let i = 0; i < response.transactions.length ; i++) {
                if (DateParser.now().compare(response.transactions[i].record.date) >= 0) {
                    this.transaction_repository.delete(response.transactions[i].id)
                }
            }

            this.presenter.success("done");
        } catch (err) {
            this.presenter.fail(err as Error);
        }
    }
}