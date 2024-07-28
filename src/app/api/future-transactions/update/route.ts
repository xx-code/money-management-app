import { AutoUpdateFutureTransactionUseCase, IAutoUpdateFutureTransactionPresenter } from "@/core/interactions/futureTransaction/autoUpdateFutureTransactionUseCase";
import { NextResponse } from "next/server";
import cron from 'node-cron'
import { initRepository } from "../../libs/init_repo";

type UpdateModelView = {
    response: string | null,
    error: Error | null
}

class AutoUpdateFutureTransactionPresenter implements IAutoUpdateFutureTransactionPresenter {
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


export async function POST(request: Request) { 
    try {
        cron.schedule('0 23 * * *', async () => {
            let presenter: AutoUpdateFutureTransactionPresenter = new AutoUpdateFutureTransactionPresenter()
            const repositories = await initRepository() 
            let auto_update_future_trans_usecase = new AutoUpdateFutureTransactionUseCase(presenter, repositories.transactionFutreRepo, repositories.transactionRepo)
            await auto_update_future_trans_usecase.execute() 
            if (presenter.model_view.error !== null) {
                console.log(presenter.model_view.error)
            }
        })
        return NextResponse.json({ data: 'Updated', status: 200 });
    } catch(err: any) {
        return NextResponse.json(err, { status: 500 })
    }
}