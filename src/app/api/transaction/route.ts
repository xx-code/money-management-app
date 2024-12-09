import { AddTransactionUseCase, IAddTransactionAdapter, IAddTransactionUseCaseResponse, RequestAddTransactionUseCase } from "@/core/interactions/transaction/addTransactionUseCase"
import UUIDMaker from "@/app/services/crypto";
import { NextResponse } from "next/server";
import { initRepository } from "../libs/init_repo";

export type ApiAddTransactionResponse = {
    is_saved: boolean
}

type AddTransactionModelView = {
    response: ApiAddTransactionResponse | null,
    error: Error | null
}

class AddTransactionPresenter implements IAddTransactionUseCaseResponse {
    model_view: AddTransactionModelView = {response: null, error: null};

    success(is_saved: boolean): void {
        this.model_view.response = {is_saved: is_saved};
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
    let request_new_transaction: RequestAddTransactionUseCase = await request.json();

    let presenter = new AddTransactionPresenter();

    let repo = await initRepository()

    let adapters: IAddTransactionAdapter = {
        transaction_repository: repo.transactionRepo,
        record_repository: repo.recordRepo,
        category_repository: repo.categoryRepo,
        tag_repository: repo.tagRepo,
        account_repository: repo.accountRepo,
        crypto: new UUIDMaker()
    }

    let use_case = new AddTransactionUseCase(adapters, presenter);
    await use_case.execute(request_new_transaction);

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}