import { DateParser, isEmpty, Money } from "@/core/domains/helpers";
import { TransactionRepository, TransactionFilter } from "../../repositories/transactionRepository";
import ValidationError from "@/core/errors/validationError";
import { mapperTransactionType } from "@/core/mappers/transaction";

export type RequestGetBalanceBy = {
    accounts_id: string[] | null | undefined,
    tags_filter: string[] | null | undefined,
    categories_filter: string[] | undefined,
    date_start: string | null | undefined,
    date_end: string | null | undefined,
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
            if (!isEmpty(request.accounts_id))
                accounts_id = request.accounts_id!

            let tags_filter: string[] = [];
            if (!isEmpty(request.tags_filter))
                tags_filter = request.tags_filter!

            let categories_filter: string[] = [];
            if (!isEmpty(request.categories_filter))
                categories_filter = request.categories_filter!

            if (!isEmpty(request.date_start) && !isEmpty(request.date_end)) {
                if (DateParser.fromString(request.date_end!).compare(DateParser.fromString(request.date_start!)) < 0) {
                    throw new ValidationError('Date start must be less than date end');
                }
            }

            let date_start = null
            if (!isEmpty(request.date_start))
                date_start = DateParser.fromString(request.date_start!)
            
            let date_end = null
            if (!isEmpty(request.date_end))
                date_end = DateParser.fromString(request.date_end!) 

            let type = null;
            if (!isEmpty(request.type)) {
                type = mapperTransactionType(request.type!)
            }

            let price = null;
            if (!isEmpty(request.price)) {
                price = new Money(request.price)
            }

            let filter: TransactionFilter = {
                accounts: accounts_id,
                categories: categories_filter,
                tags: tags_filter,
                start_date: date_start?.toString(),
                end_date: date_end?.toString(),
                type: type,
                price: price?.getAmount()
            }


            let balance = await this.transaction_repository.getBalance(filter);

            this.presenter.success(balance);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}