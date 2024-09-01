import DateParser from "@/core/entities/date_parser";
import { ValidationError } from "@/core/errors/validationError";
import { TransactionRepository, dbFilter } from "../repositories/transactionRepository";
import { TransactionType, is_Transaction_type } from "@/core/entities/transaction";
import { is_empty } from "@/core/entities/verify_empty_value";
import { formatted } from "@/core/entities/formatted";

export type RequestGetBalanceBy = {
    accounts_id: string[] | null | undefined,
    tags_filter: string[] | undefined,
    categories_filter: string[] | undefined,
    date_start: DateParser | null | undefined,
    date_end: DateParser | null | undefined,
    type: string | null | undefined,
    price: number | undefined,
}

interface IGetBalanceByUseCase {
    execute(request: RequestGetBalanceBy): void;
}

export interface IGetBalanceByUseCaseResponse {
    success(balance: number): void;
    fail(err: Error): void
}

export class GetBalanceByUseCase implements IGetBalanceByUseCase {
    private transaction_repository: TransactionRepository;
    private presenter: IGetBalanceByUseCaseResponse;

    constructor(transaction_repo: TransactionRepository, presenter: IGetBalanceByUseCaseResponse) {
        this.transaction_repository = transaction_repo;
        this.presenter = presenter;
    }

    async execute(request: RequestGetBalanceBy): Promise<void> {
        try {
            let accounts_id: string[] = [];
            if (request.accounts_id !== null && request.accounts_id !== undefined) {
                accounts_id = request.accounts_id;
            }

            let tags_filter: string[] = [];
            if (request.tags_filter !== undefined) {
                tags_filter = request.tags_filter.map(format => formatted(format));
            }

            let categories_filter: string[] = [];
            if (request.categories_filter !== undefined) {
                categories_filter = request.categories_filter;
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

            let filter: dbFilter = {
                accounts: accounts_id,
                categories: categories_filter,
                tags: tags_filter,
                start_date: request.date_start,
                end_date: request.date_end,
                type: type,
                price: price
            }

            let balance = await this.transaction_repository.get_balance(filter);

            this.presenter.success(balance);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}