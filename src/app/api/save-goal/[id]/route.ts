import { IGetSaveGoalPresenter, GetSaveGoalUseCase } from "@/core/interactions/saveGoal/getSaveGoal"
import { NextResponse } from "next/server"
import { initRepository } from "../../libs/init_repo"
import { DeleteSaveGoalUseCase, IDeleteSaveGoalPresenter, RequestDeleteSaveGoal } from "@/core/interactions/saveGoal/deleteSaveGoal"
import { IUpdateSaveGoalPresenter, RequestUpdateSaveGoal, UpdateSaveGoalUseCase } from "@/core/interactions/saveGoal/updateSaveGoal"
import { SaveGoalDisplay } from "@/core/entities/save_goal"

type GetModelView = {
    response: SaveGoalDisplay | null,
    error: Error | null
}

class GetGoalPresenter implements IGetSaveGoalPresenter {
    model_view: GetModelView = {response: null, error: null}

    success(response: SaveGoalDisplay): void {
        this.model_view.response = response 
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

type DeleteModelView = {
    response: boolean | null,
    error: Error | null
}

class DeleteSaveGoalPresenter implements IDeleteSaveGoalPresenter {
    model_view: DeleteModelView = {response: null, error: null}

    success(response: boolean): void {
        this.model_view.response = response 
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.response = null
        this.model_view.error = err
    }
}


export async function DELETE(
    request: Request,
    { params }: { params: {id: string} }
) {
    let presenter = new DeleteSaveGoalPresenter()

    let repo = await initRepository()

    let use_case = new DeleteSaveGoalUseCase(presenter, repo.transactionRepo, repo.accountRepo, repo.savingRepo)
   
    let req: RequestDeleteSaveGoal = await request.json()

    await use_case.execute(req) 

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }
    
    return NextResponse.json(presenter.model_view.response, {status: 200}); 
}

type UpdateModelView = {
    response: boolean | null,
    error: Error | null
}

class UpdateSaveGoalPresenter implements IUpdateSaveGoalPresenter {
    model_view: UpdateModelView = {response: null, error: null}

    success(response: boolean): void {
        this.model_view.response = response 
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

    let req: RequestUpdateSaveGoal = await request.json()

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