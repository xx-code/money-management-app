import { DB_FILENAME, account_repo, budget_tag_repo, category_repo, record_repo, tag_repo, transaction_repo } from "@/app/configs/repository";
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "@/core/entities/budget";
import DateParser from "@/core/entities/date_parser";
import { is_empty } from "@/core/entities/verify_empty_value";
import { CreationBudgetTagUseCase, CreationBudgetTagUseCaseRequest, ICreationBudgetUseCaseResponse } from "@/core/interactions/budgets/creationBudgetUseCase";
import { GetAllBudgetTagUseCase, IGetAllBudgetUseCaseResponse } from "@/core/interactions/budgets/getAllBudgetUseCase";
import UUIDMaker from "@/services/crypto";
import { NextResponse } from "next/server";

type CreationBudgetWithTagModelView = {
    response: {is_saved: boolean} | null,
    error: Error | null
}

class CreationBudgetWithTagPresenter implements ICreationBudgetUseCaseResponse {
    model_view: CreationBudgetWithTagModelView = {response: null, error: null};

    success(is_saved: boolean): void {
        this.model_view.response = {is_saved: is_saved};
        this.model_view.error = null;
    }
    
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function POST(
    request: Request
) {
    let uuid = new UUIDMaker();

    let new_budget = await request.json();

    if (is_empty(new_budget.date_start)) {
        return new Response(
            'Date start field is empty',
            {status: 400}
        );
    }
    
    if (is_empty(new_budget.date_end)) {
        return new Response(
            'Date end field is empty',
            {status: 400}
        );
    }
    
    let request_budget_Tag: CreationBudgetTagUseCaseRequest = {
        title: new_budget.title,
        target: new_budget.target,
        date_start: DateParser.from_string(new_budget.date_start),
        date_end: DateParser.from_string(new_budget.date_end),
        tags: new_budget.tags
    }

    let presenter = new CreationBudgetWithTagPresenter();

    await tag_repo.init(DB_FILENAME);
    await budget_tag_repo.init(DB_FILENAME, tag_repo.table_tag_name);

    let use_case = new CreationBudgetTagUseCase(budget_tag_repo, tag_repo, presenter, uuid);
    await use_case.execute(request_budget_Tag);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        );
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type GetAllBudgetWithTagModelView = {
    response: { budgets: BudgetWithTagDisplay[] } | null,
    error: Error | null
}

class GetAllBudgetWithTagsPresenter implements IGetAllBudgetUseCaseResponse{
    model_view: GetAllBudgetWithTagModelView = {response: null, error: null};

    success(budgets: (BudgetWithCategoryDisplay | BudgetWithTagDisplay)[]): void {
        this.model_view.response = {budgets: <BudgetWithTagDisplay[]>budgets};
        this.model_view.error = null;
    }
   
    fail(err: Error): void {
        this.model_view.response = null;
        this.model_view.error = err;
    }

}

export async function GET() {
    let presenter = new GetAllBudgetWithTagsPresenter();

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);
    await budget_tag_repo.init(DB_FILENAME, tag_repo.table_tag_name);

    let use_case = new GetAllBudgetTagUseCase(budget_tag_repo, transaction_repo, presenter);
    await use_case.execute();

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}
