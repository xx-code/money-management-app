import { DB_FILENAME, account_repo, category_repo, record_repo, tag_repo, transaction_repo } from "@/app/configs/repository";
import { Transaction } from "@/core/entities/transaction"
import { DeleteTransactionUseCase, IDeleteTransactoinUseCaseResponse } from "@/core/interactions/transaction/deleteTransactionUseCase";
import { GetTransactionUseCase, IGetTransactionUseCaseResponse } from "@/core/interactions/transaction/getTransactionUseCase"
import { IUpdateTransactionUseCaseResponse, RequestUpdateTransactionUseCase, UpdateTransactionUseCase } from "@/core/interactions/transaction/updateTransactionUseCase";
import { NextResponse } from "next/server";

type GetTransaction = {
    response : {
        account_id: string, category_title: string, category_icon: string, date: string,
        tags: string[], type: string, price: number, description: string} | null,
    error: Error | null
}

class GetTransactionPresenter implements IGetTransactionUseCaseResponse {
    model_view: GetTransaction = {response: null, error: null};

    success(transaction: Transaction): void {
        this.model_view.response = {
            account_id: transaction.account.id, 
            category_title: transaction.category.title,
            category_icon: transaction.category.icon,
            tags: transaction.tags,
            description: transaction.record.description,
            date: transaction.record.date.toString(),
            price: transaction.record.price,
            type: transaction.record.type
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

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);

    let use_case = new GetTransactionUseCase(transaction_repo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        );
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

class UpdateTransactionPresenter implements IUpdateTransactionUseCaseResponse {
    model_view: GetTransaction = {response: null, error: null};

    success(transaction: Transaction): void {
        this.model_view.response = {
            account_id: transaction.account.id, 
            category_title: transaction.category.title,
            category_icon: transaction.category.icon,
            tags: transaction.tags,
            description: transaction.record.description,
            date: transaction.record.date.toString(),
            price: transaction.record.price,
            type: transaction.record.type
        }
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
    
    let request_transaction: RequestUpdateTransactionUseCase = await request.json();
    request_transaction.id = id;

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);

    let use_case = new UpdateTransactionUseCase(transaction_repo, presenter, account_repo, category_repo, tag_repo, record_repo);
    await use_case.execute(request_transaction);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type DeleteTransaction = {
    response: {is_deleted: boolean} | null,
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

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);

    let use_case = new DeleteTransactionUseCase(transaction_repo, presenter);
    use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200})
}