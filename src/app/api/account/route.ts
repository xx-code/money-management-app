import { NextResponse } from 'next/server';
import { CreationAccountUseCase, ICreationAccountUseCaseResponse, CreationAccountUseCaseRequest } from '../../../core/interactions/account/creationAccountUseCase';
import { GetAllAccountUseCase, IGetAllAccountUseCaseResponse } from '../../../core/interactions/account/getAllAccountUseCase';
import UUIDMaker from '../../../services/crypto';
import { DB_FILENAME, account_repo } from '../../configs/repository';
import { Account } from '@/core/entities/account';

type CreationAccountModelView = {
  response: boolean | null,
  error: Error | null
}

class CreationAccountApiResponse implements ICreationAccountUseCaseResponse {
  public model_view: CreationAccountModelView = { response: null, error: null };

  success(is_saved: boolean): void {
    this.model_view.response = is_saved;
    this.model_view.error = null;
  }

  fail(err: Error): void {
    this.model_view.error = err;
    this.model_view.response = null;
  }
}

export async function POST(request: Request) {
  let uuid = new UUIDMaker();
  await account_repo.init(DB_FILENAME);

  let new_account: CreationAccountUseCaseRequest = await request.json();

  let presenter = new CreationAccountApiResponse();

  let account = new CreationAccountUseCase(account_repo, uuid, presenter);

  await account.execute(new_account);

  if (presenter.model_view.error !== null) {
    console.log(presenter.model_view.error.message);
    return new Response(presenter.model_view.error.message, {
      status: 400,
    });
  }

  return new Response(presenter.model_view.response ? 'Success' : 'Fail', {
    status: 200,
  });
}

type ModelViewAllAccount = {
  error: Error | null
  response: Account[]
}

class GetAllAccountApiResponse implements IGetAllAccountUseCaseResponse {
  public model_view: ModelViewAllAccount = { error: null, response: [] };

  success(all_accounts: Account[]): void {
    this.model_view.response = all_accounts;
    this.model_view.error = null;
  }

  fail(err: Error): void {
    this.model_view.response = [];
    this.model_view.error = err;
  }
}

export async function GET() {
  await account_repo.init(DB_FILENAME);

  let presenter = new GetAllAccountApiResponse();

  let account = new GetAllAccountUseCase(account_repo, presenter);

  await account.execute();

  if (presenter.model_view.error != null) {
    console.log(presenter.model_view.error);
    return new Response(presenter.model_view.error.message, {
      status: 400
    });
  }

  return NextResponse.json({ accounts: presenter.model_view.response }, { status: 200 });
}
