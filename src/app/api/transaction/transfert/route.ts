import { TransfertTransactionUseCase, ITransfertTransactionUseCaseResponse, RequestTransfertTransactionUseCase, ITransfertTransactionAdapter } from "@/core/interactions/transaction/transfertTransactionUseCase"
import UUIDMaker from "@/app/services/crypto";
import { NextResponse } from "next/server";
import { initRepository } from "../../libs/init_repo";

export type ApiTransfertTransactionResponse = {
    is_transfert: boolean
}

type TransfertTransactionModelView = {
    response: ApiTransfertTransactionResponse | null,
    error: Error | null
}

class AddTransactionPresenter implements ITransfertTransactionUseCaseResponse {
    model_view: TransfertTransactionModelView = {response: null, error: null};

    success(is_transfert: boolean): void {
        this.model_view.response = {is_transfert: is_transfert};
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
    let request_new_transaction: RequestTransfertTransactionUseCase = await request.json();

    let uuid = new UUIDMaker(); 

    let presenter = new AddTransactionPresenter();

    let repo = await initRepository()

    let adapters: ITransfertTransactionAdapter = {
        transaction_repository: repo.transactionRepo,
        record_repository: repo.recordRepo,
        category_repository: repo.categoryRepo,
        account_repository: repo.accountRepo,
        crypto: uuid
    }

    let use_case = new TransfertTransactionUseCase(adapters, presenter);
    await use_case.execute(request_new_transaction);

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}