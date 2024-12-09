import { GetAllAccountUseCase, IGetAllAccountUseCaseResponse } from "@/core/interactions/account/getAllAccountUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../../libs/init_repo";
import { GetAllSaveGoal, IGetAllSaveGoalPresenter, SaveGoalResponse } from "@/core/interactions/saveGoal/getAllSaveGoal";

export type ApiSaveGoalResponse = {
  id: string
  title: string
  description: string
  target: number 
  balance: number
}

type ModelViewAllAccount = {
  error: Error | null
  response: ApiSaveGoalResponse[]
}
  
class GetAllAccountApiResponse implements IGetAllSaveGoalPresenter {
  public model_view: ModelViewAllAccount = { error: null, response: [] };

  success(all_save_goal: SaveGoalResponse[]): void {
    let save_goals: ApiSaveGoalResponse[] = []
    for(let save_goal of all_save_goal) {
      save_goals.push({
        id: save_goal.id,
        title: save_goal.title,
        description: save_goal.description,
        target: save_goal.target,
        balance: save_goal.balance
      })
    }
    this.model_view.response = save_goals;
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
    let account = new GetAllSaveGoal(repo.accountRepo, repo.transactionRepo, presenter);
    await account.execute(true);
  
    if (presenter.model_view.error != null) {
      return new Response(presenter.model_view.error.message, {
        status: 400
      });
    }
  
    return NextResponse.json({ accounts: presenter.model_view.response }, { status: 200 });
}