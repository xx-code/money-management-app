import { DB_FILENAME, account_repo, category_repo, record_repo, tag_repo, transaction_repo } from "@/app/configs/repository";
import DateParser from "@/core/entities/date_parser";
import { Transaction } from "@/core/entities/transaction";
import { is_empty } from "@/core/entities/verify_empty_value";
import { GetPaginationTransaction, IGetPaginationTransactionResponse, RequestGetPagination, TransactionResponse } from "@/core/interactions/transaction/getPaginationTransactionUseCase";
import { NextResponse } from "next/server";

type PaginationTransactionsModelView = {
    response: {transactions: Transaction[], current_page: number, max_pages: number} | null,
    error: Error | null
}

class PaginationTransactionPresenter implements IGetPaginationTransactionResponse {
    model_view: PaginationTransactionsModelView = {response: null, error: null};

    success(response: TransactionResponse): void {
        this.model_view.response = {transactions: response.transactions, current_page: response.current_page, max_pages: response.max_pages};
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

    
    if (!is_empty(pagination.date_start)) {
        request_get_pagination.date_start = DateParser.from_string(pagination.date_start)
    } else {
        request_get_pagination.date_start = null;
    }
    
    if (!is_empty(pagination.date_end)) {
        request_get_pagination.date_end = DateParser.from_string(pagination.date_end) 
    } else {
        request_get_pagination.date_end = null;
    }
    

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);

    let use_case = new GetPaginationTransaction(transaction_repo, account_repo, category_repo, tag_repo, record_repo, presenter);
    await use_case.execute(request_get_pagination);

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}