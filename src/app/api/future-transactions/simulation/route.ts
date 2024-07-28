import { EstimateWalletUseCase, IEstimateWalletPresenter, RequestEstimation } from "@/core/interactions/futureTransaction/estimateWalletUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../../libs/init_repo";

type EstimationWalletModelView = {
    response: {estimation: number} | null,
    error: Error | null
}

class EstimationWalletPresenter implements IEstimateWalletPresenter {
    model_view: EstimationWalletModelView = {response: null, error: null}

    success(estimation: number): void {
        this.model_view.response = {estimation: estimation}
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.response = null
        this.model_view.error = err
    }
}

export async function POST(request: Request) {
    let new_transaction_request: RequestEstimation = await request.json();

    const presenter: EstimationWalletPresenter = new EstimationWalletPresenter()

    const repositories = await initRepository() 

    const use_case: EstimateWalletUseCase = new EstimateWalletUseCase(presenter, repositories.transactionFutreRepo, repositories.transactionRepo);

    await use_case.execute(new_transaction_request)

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}