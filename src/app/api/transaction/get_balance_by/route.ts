import { DB_FILENAME, account_repo, category_repo, record_repo, tag_repo, transaction_repo } from "@/app/configs/repository";
import DateParser from "@/core/entities/date_parser";
import { is_empty } from "@/core/entities/verify_empty_value";
import { GetBalanceByUseCase, IGetBalanceByUseCaseResponse, RequestGetBalanceBy } from "@/core/interactions/transaction/getBalanceByUseCase";
import { NextResponse } from "next/server";

type GetBalanceByModelView = {
    response: {balance: number} | null,
    error: Error | null
}

class GetBalanceByPresenter implements IGetBalanceByUseCaseResponse {
    model_view: GetBalanceByModelView = {response: null, error: null};

    success(balance: number): void {
        this.model_view.response = {balance: balance};
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
    let get_balance_by = await request.json();

    let request_get_balance: RequestGetBalanceBy = get_balance_by;
    let presenter = new GetBalanceByPresenter();
    
    if (!is_empty(get_balance_by.date_start)) {
        request_get_balance.date_start = DateParser.from_string(get_balance_by.date_start)
    } else {
        request_get_balance.date_start = null;
    }
    
    if (!is_empty(get_balance_by.date_end)) {
        request_get_balance.date_end = DateParser.from_string(get_balance_by.date_end) 
    } else {
        request_get_balance.date_end = null;
    }

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);

    let use_case = new GetBalanceByUseCase(transaction_repo, presenter)
    await use_case.execute(request_get_balance);

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}