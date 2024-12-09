import { NextResponse } from "next/server";
import cron from 'node-cron'
import { initRepository } from "../../libs/init_repo";
import { AutoUpdateBudgetUseCase, IAutoUpdateBudgetPresenter } from "@/core/interactions/budgets/autoUpdateBudgetUseCase";
import UUIDMaker from "@/app/services/crypto";

type UpdateModelView = {
    response: string | null,
    error: Error | null
}

class AutoUpdateBudgetPresenter implements IAutoUpdateBudgetPresenter {
    model_view: UpdateModelView = {response: null, error: null}

    success(message: string): void {
        this.model_view.response = message 
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.response = null
        this.model_view.error = err
    }
}

async function executeAutoUpdate() {            
    let presenter: AutoUpdateBudgetPresenter = new AutoUpdateBudgetPresenter()
    const repositories = await initRepository() 
    let auto_update_budget_usecase = new AutoUpdateBudgetUseCase(presenter, repositories.budgetRepo, repositories.transactionRepo)
    await auto_update_budget_usecase.execute() 
    if (presenter.model_view.error !== null) {
        console.log(presenter.model_view.error)
    } else {
        console.log(presenter.model_view.response)
    }
}

export async function POST(request: Request) { 
    try {
        await executeAutoUpdate()
        cron.schedule('0 23 * * *', async () => {
            await executeAutoUpdate()
        })
        return NextResponse.json({ data: 'Updated', status: 200 });
    } catch(err: any) {
        return NextResponse.json(err, { status: 500 })
    }
}