import { AddFutureTransactionUseCase, IAddFutureTransactionPresenter, IAddFutureTransactionUseCase, RequestAddFutureTransaction } from "@/core/interactions/futureTransaction/addFutureTransactionUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../libs/init_repo";
import UUIDMaker from "@/services/crypto";
import { GetAllFutureTransactionUseCase, IGetAllFutureTransactionPresenter } from "@/core/interactions/futureTransaction/getAllFutureTransactionUseCase";
import { FutureTransaction } from "@/core/entities/future_transaction";

type GetAllFutureTransactionModelView = {
    response: FutureTransaction[] | null,
    error: Error | null
}

class GetAllFutureTransactionPresenter implements IGetAllFutureTransactionPresenter {
    model_view: GetAllFutureTransactionModelView = {response: null, error: null}

    success(future_transactions: FutureTransaction[]): void {
        this.model_view.response = future_transactions
        this.model_view.error = null 
    }
    fail(error: Error): void {
        this.model_view.response = null
        this.model_view.error = error
    }
    
}

export async function GET() {
    const presenter: GetAllFutureTransactionPresenter = new GetAllFutureTransactionPresenter()

    const respositories = await initRepository()

    const use_case = new GetAllFutureTransactionUseCase(presenter, respositories.transactionFutreRepo)

    await use_case.execute()

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type AddFutureTransactionModelView = {
    response: {id_transaction: string} | null,
    error: Error | null
}

class AddFutureTransactionPresenter implements IAddFutureTransactionPresenter {
    model_view: AddFutureTransactionModelView = {response: null, error: null};

    success(id_new_trans: string): void {
        this.model_view.response = {id_transaction: id_new_trans}
        this.model_view.error = null;
    }

    fail(err: Error): void {
        this.model_view.response = null
        this.model_view.error = err
    }
}

export async function POST(request: Request) {
    let new_transaction_request: RequestAddFutureTransaction = await request.json();

    const presenter: AddFutureTransactionPresenter = new AddFutureTransactionPresenter()

    const repositories = await initRepository()

    let uuid = new UUIDMaker(); 

    const use_case: AddFutureTransactionUseCase = new AddFutureTransactionUseCase(repositories.categoryRepo, repositories.recordRepo, repositories.accountRepo, repositories.transactionFutreRepo, uuid, presenter);

    await use_case.execute(new_transaction_request)

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}