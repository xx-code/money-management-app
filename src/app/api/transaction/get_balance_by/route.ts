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
        let [year_start, month_start, day_start] = get_balance_by.date_start.split('-');
        request_get_balance.date_start = new DateParser(Number(year_start), Number(month_start), Number(day_start));
    }

    if (!is_empty(get_balance_by.date_end)) {
        let [year_end, month_end, day_end] = get_balance_by.date_end.split('-');
        request_get_balance.date_end = new DateParser(Number(year_end),Number( month_end), Number(day_end));
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