import { DB_FILENAME, account_repo, budget_categories_repo, category_repo, record_repo, tag_repo, transaction_repo } from "@/app/configs/repository"
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "@/core/entities/budget"
import { DeleteBudgetCategoryUseCase, IDeleteBudgetUseCaseResponse } from "@/core/interactions/budgets/deleteBudgetUseCase"
import { GetBudgetCategoryUseCase, IGetBudgetUseCaseResponse } from "@/core/interactions/budgets/getBudgetUseCase"
import { RequestpdateCategoryBudget, UpdateBudgetCategoryUseCase } from "@/core/interactions/budgets/updateBudgetUseCase"
import { json } from "body-parser"
import { NextResponse } from "next/server"

type GetBudgetWithCategory = {
    response: {
        id: string,
        title: string,
        target: number,
        current: number,
        period: string,
        period_time: number,
    } | null,
    error: Error | null
}

class GetBudgetWithCategoryPresenter implements IGetBudgetUseCaseResponse {
    model_view: GetBudgetWithCategory = {response: null, error: null}

    success(budget: BudgetWithCategoryDisplay | BudgetWithTagDisplay): void {
        let budget_category = <BudgetWithCategoryDisplay>budget
        this.model_view.response = {
            id: budget_category.id,
            title: budget_category.title,
            target: budget_category.target,
            current: budget_category.current,
            period: budget_category.period,
            period_time: budget_category.period_time
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
    let presenter = new GetBudgetWithCategoryPresenter();

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);
    await budget_categories_repo.init(DB_FILENAME, category_repo.table_category_name); 

    let use_case = new GetBudgetCategoryUseCase(budget_categories_repo, transaction_repo, presenter);
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
    let presenter = new GetBudgetWithCategoryPresenter();

    let request_obj = await request.json();
    let request_budget: RequestpdateCategoryBudget = request_obj;
    request_budget.categories = Object.assign([], request_obj.categories);
    request_budget.id = id;

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);
    await budget_categories_repo.init(DB_FILENAME, category_repo.table_category_name); 

    let use_case = new UpdateBudgetCategoryUseCase(budget_categories_repo, transaction_repo, category_repo, presenter);
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

    await category_repo.init(DB_FILENAME);
    await budget_categories_repo.init(DB_FILENAME, category_repo.table_category_name); 

    let use_case = new DeleteBudgetCategoryUseCase(budget_categories_repo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }


    return NextResponse.json(presenter.model_view.response, {status: 200});
}