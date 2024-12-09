import { NextResponse } from 'next/server';
import { CreationAccountUseCase, ICreationAccountUseCaseResponse, RequestCreationAccountUseCase } from '../../../core/interactions/account/creationAccountUseCase';
import { GetAllAccountUseCase, IGetAllAccountUseCaseResponse } from '../../../core/interactions/account/getAllAccountUseCase';
import UUIDMaker from '../../services/crypto';
import { AccountResponse } from '@/core/interactions/account/getAccountUseCase';
import { initRepository } from '../libs/init_repo';

export type ApiCreateAccountResponse = {
  is_created: boolean
}

type CreationAccountModelView = {
  response: ApiCreateAccountResponse | null,
  error: Error | null
}

class CreationAccountApiResponse implements ICreationAccountUseCaseResponse {
  public model_view: CreationAccountModelView = { response: null, error: null };

  success(is_saved: boolean): void {
    this.model_view.response = {is_created: is_saved}
    this.model_view.error = null;
  }

  fail(err: Error): void {
    this.model_view.error = err;
    this.model_view.response = null;
  }
}

export async function POST(request: Request) {
  let uuid = new UUIDMaker();
  
  let repo = await initRepository()

  let new_account: RequestCreationAccountUseCase = await request.json();

  let presenter = new CreationAccountApiResponse();

  let account = new CreationAccountUseCase(repo.accountRepo, uuid, presenter);

  await account.execute(new_account);

  if (presenter.model_view.error !== null) {
    return new Response(presenter.model_view.error.message, {
      status: 400,
    });
  }

  return NextResponse.json(presenter.model_view.response, { status: 200 });
}

export type ApiGetAllAccountResponse = {
  account_id: string
  title: string
  balance: number
}

type ModelViewAllAccount = {
  error: Error | null
  response: ApiGetAllAccountResponse[]
}

class GetAllAccountApiResponse implements IGetAllAccountUseCaseResponse {
  public model_view: ModelViewAllAccount = { error: null, response: [] };

  success(all_accounts: AccountResponse[]): void {
    let accounts: ApiGetAllAccountResponse[] = []
    for (let account of all_accounts) {
      accounts.push({
        account_id: account.account_id, 
        title: account.title,
        balance: account.balance
      })
    }

    this.model_view.response = accounts
    this.model_view.error = null
  }

  fail(err: Error): void {
    this.model_view.response = [];
    this.model_view.error = err;
  }
}

export async function GET() {
  let presenter = new GetAllAccountApiResponse();

  let repo = await initRepository()
  
  let account = new GetAllAccountUseCase(repo.accountRepo, repo.transactionRepo, presenter);

  await account.execute();

  if (presenter.model_view.error != null) {
    return new Response(presenter.model_view.error.message, {
      status: 400
    });
  }

  return NextResponse.json(presenter.model_view.response, { status: 200 });
}
