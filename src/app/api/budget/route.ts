import { CreationBudgetUseCase, CreationBudgetUseCaseRequest } from "@/core/interactions/budgets/creationBudgetUseCase";
import { BudgetOutput, GetAllBudgetUseCase, IGetAllBudgetUseCaseResponse } from "@/core/interactions/budgets/getAllBudgetUseCase";
import { ICreationCategoryUseCaseResponse } from "@/core/interactions/category/creationCategoryUseCase";
import UUIDMaker from "@/services/crypto";
import { NextResponse } from "next/server";
import { initRepository } from "../libs/init_repo";

type CreationBudgetModelView = {
    response: {is_saved: boolean} | null,
    error: Error | null
}

class CreationBudgetWithCategoryPresenter implements ICreationCategoryUseCaseResponse {
    model_view: CreationBudgetModelView = {response: null, error: null};

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
    let request_budget_category: CreationBudgetUseCaseRequest = request_obj;
    // request_budget_category.categories = JSON.parse(request_obj);

    let presenter = new CreationBudgetWithCategoryPresenter();

    const repo = await initRepository() 

    let use_case = new CreationBudgetUseCase(repo.budgetRepo, repo.categoryRepo, repo.tagRepo, presenter, uuid);
    await use_case.execute(request_budget_category);

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        );
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type GetAllBudgeModelView = {
    response: { budgets: BudgetOutput[] } | null,
    error: Error | null
}

class GetAllBudgetWithCategoriesPresenter implements IGetAllBudgetUseCaseResponse{
    model_view: GetAllBudgeModelView = {response: null, error: null};

    success(budgets: BudgetOutput[]): void {
        this.model_view.response = {budgets: budgets};
        this.model_view.error = null;
    }
   
    fail(err: Error): void {
        this.model_view.response = null;
        this.model_view.error = err;
    }

}

export async function GET() {
    let presenter = new GetAllBudgetWithCategoriesPresenter();

    let repo = await initRepository()

    let use_case = new GetAllBudgetUseCase(repo.budgetRepo, repo.categoryRepo, repo.transactionRepo, presenter);
    await use_case.execute();

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200})
}
