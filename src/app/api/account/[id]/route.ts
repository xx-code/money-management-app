import { DB_FILENAME, account_repo, category_repo, record_repo, tag_repo, transaction_repo } from '@/app/configs/repository';
import { GetAccountUseCase, IGetAccountUseCaseResponse } from '../../../../core/interactions/account/getAccountUseCase';
import { NextResponse } from 'next/server';
import { Account, AccountDisplay } from '@/core/entities/account';
import { DeleteAccountUseCase, IDeleteAccountUseCaseResponse } from '@/core/interactions/account/deleteAccountUseCase';
import { IUpdateAccountUseCaseResponse, RequestUpdateAccountUseCase, UpdateAccountUseCase } from '@/core/interactions/account/updateAccountUseCase';

type CreationAccountModelView = {
    response: {title: string, credit_value: number, credit_limit: number, balance: number} | null,
    error: Error | null
    }
   

class GetAccountApiResponse implements IGetAccountUseCaseResponse {
    model_view: CreationAccountModelView = {response: null, error: null};

    success(account: AccountDisplay): void {
        this.model_view.response = {title: account.title, credit_value: account.credit_value, balance: 0, credit_limit: account.credit_limit};
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

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);

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

type DeleteAccountModelView = {
    response: {is_deleted: boolean} | null,
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

    await account_repo.init(DB_FILENAME);

    let presenter = new DeleteAccountPresenter();

    let use_case = new DeleteAccountUseCase(account_repo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400
        });
    }

    return NextResponse.json(presenter.model_view.response, { status: 200 });
}

type UpdateAccountModelView = {
    response: {title: string, credit_value: number, credit_limit: number, balance: number} | null,
    error: Error | null
}

class UpdateAccountPresenter implements IUpdateAccountUseCaseResponse {
    model_view: UpdateAccountModelView = {response: null, error: null};

    success(account_updated: Account): void {
        this.model_view.response = { title: account_updated.title, credit_value: account_updated.credit_value, credit_limit: account_updated.credit_limit, balance: 0 };
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

    await account_repo.init(DB_FILENAME);

    let presenter = new UpdateAccountPresenter();

    let request_update: RequestUpdateAccountUseCase = await request.json();
    request_update.id = id;

    let use_case = new UpdateAccountUseCase(account_repo, presenter);
    await use_case.execute(request_update);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400
        });
    }

    return NextResponse.json(presenter.model_view.response, { status: 200 });
}