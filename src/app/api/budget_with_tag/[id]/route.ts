import { DB_FILENAME, account_repo, budget_tag_repo, category_repo, record_repo, tag_repo, transaction_repo } from "@/app/configs/repository";
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "@/core/entities/budget"
import DateParser from "@/core/entities/date_parser";
import { is_empty } from "@/core/entities/verify_empty_value";
import { DeleteBudgetTagUseCase, IDeleteBudgetUseCaseResponse } from "@/core/interactions/budgets/deleteBudgetUseCase"
import { GetBudgetTagUseCase, IGetBudgetUseCaseResponse } from "@/core/interactions/budgets/getBudgetUseCase"
import { RequestUpdateTagBudget, UpdateBudgetTagUseCase } from "@/core/interactions/budgets/updateBudgetUseCase"
import { NextResponse } from "next/server"

type GetBudgetWithTag = {
    response: {
        id: string,
        title: string,
        target: number,
        current: number,
        date_start: string,
        date_end: string,
        tags: string[]
    } | null,
    error: Error | null
}

class GetBudgetWithTagPresenter implements IGetBudgetUseCaseResponse {
    model_view: GetBudgetWithTag = {response: null, error: null}

    success(budget: BudgetWithCategoryDisplay | BudgetWithTagDisplay): void {
        let budget_tag = <BudgetWithTagDisplay>budget
        this.model_view.response = {
            id: budget_tag.id,
            title: budget_tag.title,
            target: budget_tag.target,
            current: budget_tag.current,
            date_start: budget_tag.date_start.toString(),
            date_end: budget_tag.date_end.toString(),
            tags: budget_tag.tags
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
    let presenter = new GetBudgetWithTagPresenter();

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);
    await budget_tag_repo.init(DB_FILENAME, tag_repo.table_tag_name); 

    let use_case = new GetBudgetTagUseCase(budget_tag_repo, transaction_repo, presenter);
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
    let presenter = new GetBudgetWithTagPresenter();

    let budget = await request.json()
    let request_budget: RequestUpdateTagBudget = budget;
    // request_budget.tags = JSON.parse(budget.tags);
    request_budget.id = id;

    if (!is_empty(budget.date_start)) {
        let [year_start, month_start, day_start] = budget.date_start.split('-');
        request_budget.date_start = new DateParser(Number(year_start), Number(month_start), Number(day_start));
    }

    if (!is_empty(budget.date_end)) {
        let [year_end, month_end, day_end] = budget.date_end.split('-');
        request_budget.date_end = new DateParser(Number(year_end),Number( month_end), Number(day_end));
    }

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);
    await budget_tag_repo.init(DB_FILENAME, tag_repo.table_tag_name); 

    let use_case = new UpdateBudgetTagUseCase(budget_tag_repo, transaction_repo, presenter, tag_repo);
    await use_case.execute(request_budget);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type DeleteBudgetWithTagModelView = {
    response: {is_deleted: boolean} | null,
    error: Error | null
}

class DeleteBudgetWithTagResponse implements IDeleteBudgetUseCaseResponse {
    model_view: DeleteBudgetWithTagModelView = {
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

    let presenter = new DeleteBudgetWithTagResponse();

    await tag_repo.init(DB_FILENAME);
    await budget_tag_repo.init(DB_FILENAME, category_repo.table_category_name); 

    let use_case = new DeleteBudgetTagUseCase(budget_tag_repo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }


    return NextResponse.json(presenter.model_view.response, {status: 200});
}