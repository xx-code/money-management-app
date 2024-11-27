import { GetBalanceByUseCase, IGetBalanceByUseCaseResponse, RequestGetBalanceBy } from "@/core/interactions/transaction/getBalanceByUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../../libs/init_repo";

export type ApiGetBalanceResponse = {
    balance: number
}

type GetBalanceByModelView = {
    response: ApiGetBalanceResponse | null,
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
    
    let repo = await initRepository()

    let use_case = new GetBalanceByUseCase(repo.transactionRepo, presenter)
    await use_case.execute(request_get_balance);

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}