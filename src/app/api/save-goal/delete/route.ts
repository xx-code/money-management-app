import { DeleteSaveGoalUseCase, IDeleteSaveGaolAdapter, IDeleteSaveGoalPresenter, RequestDeleteSaveGoal } from "@/core/interactions/saveGoal/deleteSaveGoal"
import { initRepository } from "../../libs/init_repo"
import { NextResponse } from "next/server"

export type ApiDeleteSaveGoalResponse = {
    is_deleted: boolean
}

type DeleteModelView = {
    response: ApiDeleteSaveGoalResponse | null,
    error: Error | null
}

class DeleteSaveGoalPresenter implements IDeleteSaveGoalPresenter {
    model_view: DeleteModelView = {response: null, error: null}

    success(response: boolean): void {
        this.model_view.response = { is_deleted: response } 
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.response = null
        this.model_view.error = err
    }
}


export async function POST(
    request: Request,
    { params }: { params: {id: string} }
) {
    let presenter = new DeleteSaveGoalPresenter()

    let repo = await initRepository()

    let adapters: IDeleteSaveGaolAdapter = {
        account_repository: repo.accountRepo,
        saving_repository: repo.savingRepo,
        transaction_repository: repo.transactionRepo
    }

    let use_case = new DeleteSaveGoalUseCase(adapters, presenter)
   
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