import { DeleteTransactionUseCase, IDeleteTransactoinUseCaseResponse } from "@/core/interactions/transaction/deleteTransactionUseCase";
import { GetTransactionUseCase, IGetTransactionAdapter, IGetTransactionUseCaseResponse, TransactionResponse } from "@/core/interactions/transaction/getTransactionUseCase"
import { IUpdateTransactionAdapter, IUpdateTransactionUseCaseResponse, RequestUpdateTransactionUseCase, UpdateTransactionUseCase } from "@/core/interactions/transaction/updateTransactionUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../../libs/init_repo";
import UUIDMaker from "@/services/crypto";

export type ApiGetTransactionResponse = {
    account_id: string, 
    category_title: string, 
    category_icon: string,
    category_color: string|null,
    date: string,
    tags: {tag_id: string, tag_value: string, tag_color: string|null}[], 
    type: string, 
    amount: number, 
    description: string
}

type GetTransaction = {
    response : ApiGetTransactionResponse | null,
    error: Error | null
}

class GetTransactionPresenter implements IGetTransactionUseCaseResponse {
    model_view: GetTransaction = {response: null, error: null};

    success(transaction: TransactionResponse): void {
        this.model_view.response = {
            account_id: transaction.account_id,
            category_title: transaction.category.title,
            category_icon: transaction.category.icon,
            category_color: transaction.category.color,
            tags: transaction.tags.map(tag => ({tag_id: tag.id, tag_value: tag.value, tag_color: tag.color})),
            description: transaction.description,
            date: transaction.date,
            amount: transaction.amount,
            type: transaction.type
        }
        this.model_view.error = null;
    }

    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function GET(
    request: Request,
    { params }: { params: {id: string} }
) {
    const id = params.id;

    let presenter = new GetTransactionPresenter();

    let repo = await initRepository()

    let adapters: IGetTransactionAdapter = {
        category_repository: repo.categoryRepo,
        record_repository: repo.recordRepo,
        tag_repository: repo.tagRepo,
        transaction_repository: repo.transactionRepo
    }

    let use_case = new GetTransactionUseCase(adapters, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        );
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

export type ApiUpdateTransactionResponse = {
    is_updated: boolean
}

type UpdateTransactionModelView = {
    response: ApiUpdateTransactionResponse | null
    error: Error | null
}

class UpdateTransactionPresenter implements IUpdateTransactionUseCaseResponse {
    model_view: UpdateTransactionModelView = {response: null, error: null};

    success(is_updated: boolean): void {
        this.model_view.response = { is_updated: is_updated }
        this.model_view.error = null;
    }

    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function PUT(
    request: Request,
    { params }: { params: {id: string} }
) {
    const id = params.id;

    let presenter = new UpdateTransactionPresenter();

    let transaction = await request.json();

    let request_transaction: RequestUpdateTransactionUseCase = transaction;
    request_transaction.id = id;
    
    let repo = await initRepository()

    let adapter: IUpdateTransactionAdapter = {
        transaction_repository: repo.transactionRepo,
        account_repository: repo.accountRepo,
        category_repository: repo.categoryRepo,
        tag_repository: repo.tagRepo,
        record_repository: repo.recordRepo,
        crypto: new UUIDMaker()
    }

    let use_case = new UpdateTransactionUseCase(adapter, presenter);
    await use_case.execute(request_transaction);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

export type IDeleteTransactionResponse = {
    is_deleted: boolean
}

type DeleteTransaction = {
    response: IDeleteTransactionResponse | null,
    error: Error | null
}

class DeleteTransactionPresenter implements IDeleteTransactoinUseCaseResponse {
    model_view: DeleteTransaction = {response: null, error: null};

    success(is_deleted: boolean): void {
        this.model_view.response = { is_deleted: is_deleted };
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }   
}

export async function DELETE(
    request: Request,
    { params }: {params: {id: string}}
) {
    const id = params.id;

    let presenter = new DeleteTransactionPresenter();

    let repo = await initRepository()

    let use_case = new DeleteTransactionUseCase(repo.transactionRepo, repo.recordRepo, presenter);
    use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200})
}