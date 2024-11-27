import { initRepository } from "@/app/api/libs/init_repo"
import { AutoDeleteFreezeBalanceUseCase, IAutoDeleteFreezeBalancePresenter } from "@/core/interactions/freezerBalance/autoDeleteFreezeBalanceUseCase"
import { NextResponse } from "next/server"
import cron from 'node-cron'

type UpdateModelView = {
    response: string | null,
    error: Error | null
}

class AutoDeleteFreezeBalancePresenter implements IAutoDeleteFreezeBalancePresenter {
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

async function executeAutoDelete() {  
    let presenter: AutoDeleteFreezeBalancePresenter = new AutoDeleteFreezeBalancePresenter()
    const repositories = await initRepository() 
    let auto_delete_freeze_usecase = new AutoDeleteFreezeBalanceUseCase(repositories.transactionRepo, repositories.recordRepo, presenter)
    await auto_delete_freeze_usecase.execute() 
    if (presenter.model_view.error !== null) {
        console.log(presenter.model_view.error)
    } else {
        console.log(presenter.model_view.response)
    }
}

export async function POST(request: Request) { 
    try {
        await executeAutoDelete()
        cron.schedule('0 23 * * *', async () => {
            await executeAutoDelete()
        })
        return NextResponse.json({ data: 'Updated', status: 200 });
    } catch(err: any) {
        return NextResponse.json(err, { status: 500 })
    }
}