import { AddFreezeBalanceUseCase, IAddFreezeBalancePresenter } from "@/core/interactions/freezerBalance/addFreezeBalanceUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../../libs/init_repo";
import UUIDMaker from "@/services/crypto";

export type ApiFreezeBalanceResponse = {
    is_freezed: boolean
}

type ModelView = {
    response: ApiFreezeBalanceResponse | null,
    error: Error | null
}

class AddFreezeBalancePresenter implements IAddFreezeBalancePresenter {
    model_view: ModelView = {response: null, error: null};

    success(is_save: boolean): void {
        this.model_view.response = {is_freezed: is_save};
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
    let req = await request.json();
    let presenter = new AddFreezeBalancePresenter()
    let repo = await initRepository()
    let use_case = new AddFreezeBalanceUseCase(repo.transactionRepo, presenter, repo.accountRepo, repo.categoryRepo, repo.tagRepo, repo.recordRepo, new UUIDMaker())
    await use_case.execute(req);

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}