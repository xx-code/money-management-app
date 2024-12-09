import { CreationBudgetUseCase, ICreationBudgetAdapter, RequestCreationBudgetUseCase } from "@/core/interactions/budgets/creationBudgetUseCase";
import { BudgetOutput, GetAllBudgetUseCase, IGetAllBudgetAdapter, IGetAllBudgetUseCaseResponse } from "@/core/interactions/budgets/getAllBudgetUseCase";
import { ICreationCategoryUseCaseResponse } from "@/core/interactions/category/creationCategoryUseCase";
import UUIDMaker from "@/app/services/crypto";
import { NextResponse } from "next/server";
import { initRepository } from "../libs/init_repo";

export type ApiCreationBudget = {
    is_saved: boolean
}

type CreationBudgetModelView = {
    response: ApiCreationBudget | null,
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
    let request_obj = await request.json();
    let request_budget_category: RequestCreationBudgetUseCase = request_obj;
    // request_budget_category.categories = JSON.parse(request_obj);

    let presenter = new CreationBudgetWithCategoryPresenter();

    const repo = await initRepository() 

    let adapters: ICreationBudgetAdapter = {
        category_repository: repo.categoryRepo,
        budget_repository: repo.budgetRepo,
        tag_repository: repo.tagRepo,
        crypo: new UUIDMaker()
    }

    let use_case = new CreationBudgetUseCase(adapters, presenter);
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

    let adapters: IGetAllBudgetAdapter = {
        budget_repository: repo.budgetRepo,
        category_repository: repo.categoryRepo,
        transaction_repository: repo.transactionRepo,
        tag_repository: repo.tagRepo
    }

    let use_case = new GetAllBudgetUseCase(adapters, presenter);
    await use_case.execute();

    if (presenter.model_view.error !== null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200})
}
