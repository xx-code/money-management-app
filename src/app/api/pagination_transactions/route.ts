import { GetPaginationTransaction, IGetPaginationTransactionAdapter, IGetPaginationTransactionResponse, RequestGetPagination, TransactionPaginationResponse, TransactionResponse } from "@/core/interactions/transaction/getPaginationTransactionUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../libs/init_repo";

export type ApiTransactionResponse = {
    transaction_id: string
    amount: number
    date: string
    description: string
    type: string
    category: {id: string, title: string, icon: string, color: string|null}
    tags: {id: string, title: string, color: string|null } []
}

type PaginationTransactionsModelView = {
    response: {transactions: ApiTransactionResponse[], max_pages: number} | null,
    error: Error | null
}

class PaginationTransactionPresenter implements IGetPaginationTransactionResponse {
    model_view: PaginationTransactionsModelView = {response: null, error: null};

    success(response: TransactionPaginationResponse): void {
        let transactions: ApiTransactionResponse[] = []
        for(let trans of response.transactions) {
            transactions.push({
                transaction_id: trans.transaction_id,
                amount: trans.amount,
                date: trans.date,
                description: trans.description,
                type: trans.type,
                category: { id: trans.category.icon, title: trans.category.title,
                    icon: trans.category.icon, color: trans.category.color
                },
                tags: trans.tags.map(tag => ({id: tag.id, title: tag.value, color: tag.color}))
            })
        }
        this.model_view.response = {transactions: transactions, max_pages: response.max_pages};
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function POST(
    request: Request
) {
    let pagination = await request.json();
    let request_get_pagination: RequestGetPagination = pagination;

    let presenter = new PaginationTransactionPresenter();

    let repos = await initRepository()

    let adapter: IGetPaginationTransactionAdapter = {
        category_repository: repos.categoryRepo,
        tag_repository: repos.tagRepo,
        record_repository: repos.recordRepo,
        transaction_repository: repos.transactionRepo,
        account_repository: repos.accountRepo
    }

    let use_case = new GetPaginationTransaction(adapter, presenter);
    await use_case.execute(request_get_pagination);

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}