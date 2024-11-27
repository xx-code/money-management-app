import { IGetSaveGoalPresenter, GetSaveGoalUseCase, SaveGoalResponse } from "@/core/interactions/saveGoal/getSaveGoal"
import { NextResponse } from "next/server"
import { initRepository } from "../../libs/init_repo"
import { IUpdateSaveGoalPresenter, RequestUpdateSaveGoalUseCase, UpdateSaveGoalUseCase } from "@/core/interactions/saveGoal/updateSaveGoal"

export type ApiSaveGoalResponse = {
    id: string,
    title: string,
    description: string,
    target: number,
    balance: number
}

type GetModelView = {
    response: ApiSaveGoalResponse | null,
    error: Error | null
}

class GetGoalPresenter implements IGetSaveGoalPresenter {
    model_view: GetModelView = {response: null, error: null}

    success(response: SaveGoalResponse): void {
        let save_goal: ApiSaveGoalResponse = {
            id: response.id,
            title: response.title,
            description: response.description,
            target: response.target,
            balance: response.balance
        }
        this.model_view.response = save_goal 
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.response = null
        this.model_view.error = err
    }
}

export async function GET(
    request: Request,
    { params }: { params: {id: string} }
) {
    let presenter = new GetGoalPresenter()

    let repo = await initRepository()

    let use_case = new GetSaveGoalUseCase(presenter, repo.transactionRepo, repo.savingRepo)

    await use_case.execute(params.id)
    
    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }
    
    return NextResponse.json(presenter.model_view.response, {status: 200});
}

export type ApiUpdateSaveGoalResponse = {
    is_updated: boolean
}

type UpdateSaveGoalModelView = {
    response: ApiUpdateSaveGoalResponse | null,
    error: Error | null
}

class UpdateSaveGoalPresenter implements IUpdateSaveGoalPresenter {
    model_view: UpdateSaveGoalModelView = {response: null, error: null}

    success(response: boolean): void {
        this.model_view.response = {is_updated: response} 
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.response = null
        this.model_view.error = err
    }
}

export async function PUT(
    request: Request,
    { params }: { params: {id: string} }
) {

    let presenter = new UpdateSaveGoalPresenter()

    let req: RequestUpdateSaveGoalUseCase = await request.json()

    let repo = await initRepository()

    let use_case = new UpdateSaveGoalUseCase(presenter, repo.savingRepo)

    await use_case.execute(req)

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }
    
    return NextResponse.json(presenter.model_view.response, {status: 200}); 
}