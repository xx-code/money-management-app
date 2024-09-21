import { NextResponse } from "next/server"
import { initRepository } from "../libs/init_repo"
import { GetAllSaveGoal, IGetAllSaveGoalPresenter, ResponseSaveGoal } from "@/core/interactions/saveGoal/getAllSaveGoal"
import { AddSaveGoalUseCase, IAddSaveGoalPresenter, RequestNewSaveGoal } from "@/core/interactions/saveGoal/addSaveGoal"
import UUIDMaker from "@/services/crypto"

type ModelView = {
    response: ResponseSaveGoal[] | null,
    error: Error | null
}

class GetAllGoalPresenter implements IGetAllSaveGoalPresenter {
    model_view: ModelView = {response: null, error: null}

    success(response: ResponseSaveGoal[]): void {
        this.model_view.response = response 
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.response = null
        this.model_view.error = err
    }
}

export async function GET(request: Request ) {
    let presenter = new GetAllGoalPresenter()

    let repo = await initRepository()

    let use_case = new GetAllSaveGoal(presenter, repo.transactionRepo, repo.savingRepo)

    await use_case.execute()
    
    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }
    
    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type CreateModeView = {
    response: boolean | null,
    error: Error | null
}

class AddSaveGoalPresenter implements IAddSaveGoalPresenter {
    model_view: CreateModeView = {response: null, error: null}

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
    let presenter = new AddSaveGoalPresenter()

    let repo = await initRepository()

    let use_case = new AddSaveGoalUseCase(repo.savingRepo, repo.accountRepo, new UUIDMaker(), presenter)
    
    let req: RequestNewSaveGoal = await request.json()

    await use_case.execute(req)

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }
    
    return NextResponse.json(presenter.model_view.response, {status: 200});
}
