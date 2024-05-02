import { DB_FILENAME, account_repo, budget_categories_repo, category_repo, record_repo, tag_repo, transaction_repo } from "@/app/configs/repository";
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "@/core/entities/budget";
import { CreationBudgetCategoryUseCase, CreationBudgetCategoryUseCaseRequest } from "@/core/interactions/budgets/creationBudgetUseCase";
import { GetAllBudgetCategoryUseCase, IGetAllBudgetUseCaseResponse } from "@/core/interactions/budgets/getAllBudgetUseCase";
import { ICreationCategoryUseCaseResponse } from "@/core/interactions/category/creationCategoryUseCase";
import UUIDMaker from "@/services/crypto";
import { NextResponse } from "next/server";

type CreationBudgetWithCategoryModelView = {
    response: {is_saved: boolean} | null,
    error: Error | null
}

class CreationBudgetWithCategoryPresenter implements ICreationCategoryUseCaseResponse {
    model_view: CreationBudgetWithCategoryModelView = {response: null, error: null};

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
    
    let request_obj = await request.json();
    let request_budget_category: CreationBudgetCategoryUseCaseRequest = request_obj;
    // request_budget_category.categories = JSON.parse(request_obj);

    let presenter = new CreationBudgetWithCategoryPresenter();

    await category_repo.init(DB_FILENAME);
    await budget_categories_repo.init(DB_FILENAME, category_repo.table_category_name);

    let use_case = new CreationBudgetCategoryUseCase(budget_categories_repo, category_repo, presenter, uuid);
    await use_case.execute(request_budget_category);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        );
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type GetAllBudgetWithCategoriesModelView = {
    response: { budgets: BudgetWithCategoryDisplay[] } | null,
    error: Error | null
}

class GetAllBudgetWithCategoriesPresenter implements IGetAllBudgetUseCaseResponse{
    model_view: GetAllBudgetWithCategoriesModelView = {response: null, error: null};

    success(budgets: (BudgetWithCategoryDisplay | BudgetWithTagDisplay)[]): void {
        this.model_view.response = {budgets: <BudgetWithCategoryDisplay[]>budgets};
        this.model_view.error = null;
    }
   
    fail(err: Error): void {
        this.model_view.response = null;
        this.model_view.error = err;
    }

}

export async function GET() {
    let presenter = new GetAllBudgetWithCategoriesPresenter();

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);
    await budget_categories_repo.init(DB_FILENAME, category_repo.table_category_name);

    let use_case = new GetAllBudgetCategoryUseCase(budget_categories_repo, transaction_repo, presenter);
    await use_case.execute();

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200})
}
