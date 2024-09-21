import { IIncreaseSaveGoalPresenter, IncreaseSaveGoalUseCase, RequestIncreaseSaveGoal } from "@/core/interactions/saveGoal/increaseSaveGoal"
import { initRepository } from "../../libs/init_repo"
import UUIDMaker from "@/services/crypto"
import { NextResponse } from "next/server"

type ModelView = {
    response: boolean | null,
    error: Error | null
}

class IncreaseSaveGoalPresenter implements IIncreaseSaveGoalPresenter {
    model_view: ModelView = {response: null, error: null}

    success(response: boolean): void {
        this.model_view.response = response 
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.response = null
        this.model_view.error = err
    }
}

export async function POST(request: Request) {
    let presenter = new IncreaseSaveGoalPresenter()

    let repo = await initRepository()

    let use_case = new IncreaseSaveGoalUseCase(presenter, repo.accountRepo, repo.savingRepo, repo.transactionRepo, repo.categoryRepo, repo.recordRepo, new UUIDMaker())
    
    let req: RequestIncreaseSaveGoal = await request.json()

    await use_case.execute(req)

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }
    
    return NextResponse.json(presenter.model_view.response, {status: 200});
}