import { DeleteBudgetUseCase, IDeleteBudgetUseCaseResponse } from "@/core/interactions/budgets/deleteBudgetUseCase"
import { GetBudgetUseCase, IGetBudgetAdpater, IGetBudgetUseCaseResponse } from "@/core/interactions/budgets/getBudgetUseCase"
import { IUpdateBudgetAdapter, IUpdateBudgetUseCase, IUpdateBudgetUseCasePresenter, RequestUpdateBudget, UpdateBudgetUseCase } from "@/core/interactions/budgets/updateBudgetUseCase"
import { NextResponse } from "next/server"
import { initRepository } from "../../libs/init_repo"
import { BudgetOutput } from "@/core/interactions/budgets/getAllBudgetUseCase"
import UUIDMaker from "@/app/services/crypto"

export type ApiGetBudget = {
    id: string,
    title: string,
    target: number,
    current: number,
    period: string|null,
    period_time: number,
    date_update: string,
    date_start: string,
    date_end: string|null,
    categories: {id: string, title: string, color: string|null}[]
    tags: {id: string, title: string, color: string|null}[]
} 

type GetBudgetModelView = {
    response: ApiGetBudget | null,
    error: Error | null
}

class GetBudgetPresenter implements IGetBudgetUseCaseResponse {
    model_view: GetBudgetModelView = {response: null, error: null}

    success(budget: BudgetOutput): void {
        let budget_res: ApiGetBudget = {
            id: budget.id,
            title: budget.title,
            target: budget.target,
            current: budget.currentBalance,
            period: budget.period,
            period_time: budget.period_time,
            date_update: budget.update_date,
            date_start: budget.start_date,
            date_end: budget.end_date,
            categories: budget.categories.map(cat => ({id: cat.id, title: cat.title, color: cat.color})),
            tags: budget.tags.map(tag => ({id: tag.id, title: tag.title, color: tag.color}))
        }

        this.model_view.response = budget_res
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.error = err
        this.model_view.response = null
    }
}


export async function GET(
    request: Request,
    { params }: {params: {id: string}}
) {
    const id = params.id;
    let presenter = new GetBudgetPresenter();
    let repo = await initRepository()
    
    let init_adapter: IGetBudgetAdpater = {
        budget_repostiroy: repo.budgetRepo,
        transaction_repository: repo.transactionRepo,
        category_repository: repo.categoryRepo,
        tag_repository: repo.tagRepo
    }

    let use_case = new GetBudgetUseCase(init_adapter, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

export type ApiUpdateBudget = {
    is_updated: boolean
}

type UpdateBudgetModelView = {
    response: ApiUpdateBudget | null,
    error: Error | null
}

class UpdateBudgetPresenter implements IUpdateBudgetUseCasePresenter {
    model_view: UpdateBudgetModelView = {response: null, error: null}

    success(is_updated: boolean): void {
        this.model_view.response = {is_updated: is_updated}
        this.model_view.error = null
    }

    fail(err: Error): void {
        this.model_view.error = err
        this.model_view.response = null
    }
} 

export async function PUT(
    request: Request,
    { params }: {params: {id: string}}
) {
    const id = params.id;
    let presenter = new UpdateBudgetPresenter();

    let request_obj = await request.json();
    let request_budget: RequestUpdateBudget = request_obj;

    let repo = await initRepository()

    let init_adapter: IUpdateBudgetAdapter = {
        budget_repository: repo.budgetRepo,
        category_repository: repo.categoryRepo,
        tag_repository: repo.tagRepo,
        crypto: new UUIDMaker()
    }

    let use_case = new UpdateBudgetUseCase(init_adapter, presenter);
    await use_case.execute(request_budget);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

export type ApiDeleteBudget = {
    is_deleted: boolean
}

type DeleteBudgetModelView = {
    response: ApiDeleteBudget | null,
    error: Error | null
}

class DeleteBudgetResponse implements IDeleteBudgetUseCaseResponse {
    model_view: DeleteBudgetModelView = {
        response: null,
        error: null
    }

    success(is_deleted: boolean): void {
        this.model_view.response = {is_deleted: is_deleted};
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function DELETE(
    request: Request,
    {params}: {params: {id: string}}
) {
    const id = params.id;

    let presenter = new DeleteBudgetResponse();

    let repo = await initRepository()

    let use_case = new DeleteBudgetUseCase(repo.budgetRepo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}