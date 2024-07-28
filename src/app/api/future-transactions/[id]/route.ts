import { FutureTransaction } from "@/core/entities/future_transaction"
import { DeleteFutureTransactionUseCase, IDeleteFutureTransactionPresenter } from "@/core/interactions/futureTransaction/deleteFutureTransactionUseCase"
import { IUpdateFutureTransactionPresenter, IUpdateFutureTransactionUseCase, UpdateFutureTransactionUseCase } from "@/core/interactions/futureTransaction/updateFutureTransactionUseCase"
import { initRepository } from "../../libs/init_repo"
import { NextResponse } from "next/server"
import { DeleteTransactionUseCase } from "@/core/interactions/transaction/deleteTransactionUseCase"

type GetFuturetransactionModelView = {
    response: FutureTransaction|null
    error: Error|null
}

export async function GET() {

}

type UpdateFuturetransactionModelView = {
    response: FutureTransaction|null
    error: Error|null
}

class UpdateFutureTransactionPresenter implements IUpdateFutureTransactionPresenter {
    model_view: UpdateFuturetransactionModelView = {response: null, error: null}

    success(updated_future_trans: FutureTransaction): void {
        this.model_view.response = updated_future_trans
        this.model_view.error = null
    }

    fail(err: Error): void {
        this.model_view.error = err
        this.model_view.response = null
    }
}

export async function PUT(request: Request) {
    let request_update_trans = await request.json()

    let repositories = await initRepository()

    let presenter: UpdateFutureTransactionPresenter = new UpdateFutureTransactionPresenter()

    let update_future_transaction_usecase = new UpdateFutureTransactionUseCase(repositories.categoryRepo, repositories.recordRepo, repositories.tagRepo, repositories.transactionFutreRepo, presenter, repositories.accountRepo)
    await update_future_transaction_usecase.execute(request_update_trans)

    if(presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        ) 
    }

    return NextResponse.json(presenter.model_view.response, {status: 200}); 
}

type DeleteFuturetransactionModelView = {
    response: boolean|null
    error: Error|null
}

class DeleteFutureTransactionPresenter implements IDeleteFutureTransactionPresenter {
    model_view: DeleteFuturetransactionModelView = {response: null, error: null}

    success(is_delete: boolean): void {
        this.model_view.response = is_delete
        this.model_view.error = null      
    }

    fail(err: Error): void {
        this.model_view.error = err
        this.model_view.response = null
    }
}

export async function DELETE(request: Request, { params }: { params: {id: string} }) {
    let repositories = await initRepository()

    let presenter: DeleteFutureTransactionPresenter = new DeleteFutureTransactionPresenter()

    let delete_future_transaction_usecase = new DeleteFutureTransactionUseCase(repositories.transactionFutreRepo, repositories.recordRepo, presenter)
    await delete_future_transaction_usecase.execute(params.id)

    if(presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        ) 
    }

    return NextResponse.json(presenter.model_view.response, {status: 200}); 
}