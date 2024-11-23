import { DeleteBudgetUseCase, IDeleteBudgetUseCaseResponse } from "@/core/interactions/budgets/deleteBudgetUseCase"
import { GetBudgetUseCase, IGetBudgetUseCaseResponse } from "@/core/interactions/budgets/getBudgetUseCase"
import { RequestUpdateBudget, UpdateBudgetUseCase } from "@/core/interactions/budgets/updateBudgetUseCase"
import { NextResponse } from "next/server"
import { initRepository } from "../../libs/init_repo"
import { BudgetOutput } from "@/core/interactions/budgets/getAllBudgetUseCase"

type GetBudgetCategory = {
    response: {
        id: string,
        title: string,
        target: number,
        current: number,
        period: string|null,
        period_time: number,
        date_update: string
    } | null,
    error: Error | null
}

class GetBudgetPresenter implements IGetBudgetUseCaseResponse {
    model_view: GetBudgetCategory = {response: null, error: null}

    success(budget: BudgetOutput): void {
        let budget_category = <BudgetOutput>budget
        this.model_view.response = {
            id: budget.id,
            title: budget.title,
            target: budget.target,
            current: budget.currentBalance,
            period: budget.period,
            period_time: budget_category.period_time,
            date_update: budget.update_date 
        };
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function GET(
    request: Request,
    { params }: {params: {id: string}}
) {
    const id = params.id;
    let presenter = new GetBudgetPresenter();
    let repo = await initRepository()
    let use_case = new GetBudgetUseCase(repo.budgetRepo, repo.categoryRepo, repo.transactionRepo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

export async function PUT(
    request: Request,
    { params }: {params: {id: string}}
) {
    const id = params.id;
    let presenter = new GetBudgetPresenter();

    let request_obj = await request.json();
    let request_budget: RequestUpdateBudget = request_obj;
    request_budget.categories = Object.assign([], request_obj.categories);
    request_budget.id = id;

    let repo = await initRepository()
    
    let use_case = new UpdateBudgetUseCase(repo.budgetRepo, repo.transactionRepo, repo.categoryRepo, repo.tagRepo, presenter);
    await use_case.execute(request_budget);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type DeleteBudgetWithCategoryModelView = {
    response: {is_deleted: boolean} | null,
    error: Error | null
}

class DeleteBudgetWithCategoryResponse implements IDeleteBudgetUseCaseResponse {
    model_view: DeleteBudgetWithCategoryModelView = {
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

    let presenter = new DeleteBudgetWithCategoryResponse();

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