import { NextResponse } from "next/server"
import { initRepository } from "../libs/init_repo"
import { GetAllSaveGoal, IGetAllSaveGoalPresenter, SaveGoalResponse } from "@/core/interactions/saveGoal/getAllSaveGoal"
import { AddSaveGoalUseCase, IAddSaveGoalPresenter, RequestAddSaveGoalUseCase } from "@/core/interactions/saveGoal/addSaveGoal"
import UUIDMaker from "@/app/services/crypto"
import { SaveGoalModel } from "../models/save-goal"


type ModelView = {
    response: SaveGoalModel[] | null,
    error: Error | null
}

class GetAllGoalPresenter implements IGetAllSaveGoalPresenter {
    model_view: ModelView = {response: null, error: null}

    success(response: SaveGoalResponse[]): void {
        let save_goals: SaveGoalModel[] = []
        for (let save_goal of response) {
            save_goals.push({
                id: save_goal.id,
                title: save_goal.title,
                description: save_goal.description,
                balance: save_goal.balance,
                target: save_goal.target,
                items: save_goal.items.map(item => ({id: item.id, link: item.link, title: item.title, htmlToTarget: item.html_to_target, price: item.price}))
            })
        }
        this.model_view.response = save_goals 
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

export type ApiCreationSaveGoal = {
    is_saved: boolean
}

type CreateSaveGoalModeView = {
    response: ApiCreationSaveGoal | null,
    error: Error | null
}

class AddSaveGoalPresenter implements IAddSaveGoalPresenter {
    model_view: CreateSaveGoalModeView = {response: null, error: null}

    success(response: boolean): void {
        this.model_view.response = {is_saved: response} 
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
    
    let req: RequestAddSaveGoalUseCase = await request.json()

    await use_case.execute(req)

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }
    
    return NextResponse.json(presenter.model_view.response, {status: 200});
}
