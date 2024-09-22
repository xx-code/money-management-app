import { Account } from "@/core/entities/account";
import { GetAllAccountUseCase, IGetAllAccountUseCaseResponse } from "@/core/interactions/account/getAllAccountUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../../libs/init_repo";

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
    let presenter = new GetAllAccountApiResponse();
    let repo = await initRepository()
    let account = new GetAllAccountUseCase(repo.accountRepo, repo.transactionRepo, presenter);
    await account.execute(true);
  
    if (presenter.model_view.error != null) {
      return new Response(presenter.model_view.error.message, {
        status: 400
      });
    }
  
    return NextResponse.json({ accounts: presenter.model_view.response }, { status: 200 });
}