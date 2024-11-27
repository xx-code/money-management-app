import { DB_FILENAME, account_repo, category_repo, record_repo, tag_repo, transaction_repo } from '@/app/configs/repository';
import { GetAccountUseCase, IGetAccountUseCaseResponse } from '../../../../core/interactions/account/getAccountUseCase';
import { NextResponse } from 'next/server';
import { DeleteAccountUseCase, IDeleteAccountUseCaseResponse } from '@/core/interactions/account/deleteAccountUseCase';
import { IUpdateAccountUseCaseResponse, RequestUpdateAccountUseCase, UpdateAccountUseCase } from '@/core/interactions/account/updateAccountUseCase';
import { AccountResponse } from '@/core/interactions/account/getAllAccountUseCase';
import { initRepository } from '../../libs/init_repo';

export type ApiGetAccountResponse = {
    title: string,
    balance: number
} 

type CreationAccountModelView = {
    response: ApiGetAccountResponse | null,
    error: Error | null
}
   

class GetAccountApiResponse implements IGetAccountUseCaseResponse {
    model_view: CreationAccountModelView = {response: null, error: null};

    success(account: AccountResponse): void {
        this.model_view.response = {title: account.title,  balance: 0};
        this.model_view.error = null;
    }
    fail(error: Error): void {
        this.model_view.error = error;
        this.model_view.response = null;
        
    }
}

export async function GET(
    request: Request,
    { params }: { params: {id: string} }
) {
    const id = params.id;

    let repo = await initRepository()
    await transaction_repo.init(DB_FILENAME, repo.accountRepo, repo.categoryRepo, repo.tagRepo, repo.recordRepo);

    let presenter = new GetAccountApiResponse();

    let use_case = new GetAccountUseCase(account_repo, transaction_repo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400
        });
    }

    return NextResponse.json(presenter.model_view.response, { status: 200 });
}

export type ApiDeleteAccountResponse = {
    is_deleted: boolean 
}

type DeleteAccountModelView = {
    response: ApiDeleteAccountResponse | null,
    error: Error|null
} 

class DeleteAccountPresenter implements IDeleteAccountUseCaseResponse {
    model_view: DeleteAccountModelView = {response: null, error: null}; 

    success(is_deleted: boolean): void {
        this.model_view.response = {is_deleted: is_deleted};
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.response = null;
        this.model_view.error = err;
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: {id: string} }
) {
    const id = params.id;

    let repo = await initRepository()

    let presenter = new DeleteAccountPresenter();

    let use_case = new DeleteAccountUseCase(repo.accountRepo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400
        });
    }

    return NextResponse.json(presenter.model_view.response, { status: 200 });
}

export type ApiUpdateAccountResponse = {
    is_updated: boolean 
}

type UpdateAccountModelView = {
    response: ApiUpdateAccountResponse | null,
    error: Error | null
}

class UpdateAccountPresenter implements IUpdateAccountUseCaseResponse {
    model_view: UpdateAccountModelView = {response: null, error: null};

    success(is_updated: boolean): void {
        this.model_view.response = {is_updated: is_updated}
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.response = null;
        this.model_view.error = err;
    }
}

export async function PUT(
    request: Request,
    { params }: { params: {id: string} }
) {
    const id = params.id;

    let repo = await initRepository()

    let presenter = new UpdateAccountPresenter();

    let request_update: RequestUpdateAccountUseCase = await request.json();
    request_update.id = id;

    let use_case = new UpdateAccountUseCase(repo.accountRepo, presenter);
    await use_case.execute(request_update);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400
        });
    }

    return NextResponse.json(presenter.model_view.response, { status: 200 });
}