import { DeleteCategoryUseCase, IDeleteCategoryUseCaseResponse } from "@/core/interactions/category/deleteCategoryUseCase";
import { CategoryResponse, GetCategoryUseCase, IGetCategoryUseCaseResponse } from "@/core/interactions/category/getCategoryUseCase"
import { RequestUpdateCategoryUseCase, UpdateCategoryUseCase } from "@/core/interactions/category/updateCategoryUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../../libs/init_repo";
import { CategoryModel } from "../../models/categories";

type GetCategoryModelView = {
    response: CategoryModel | null,
    error: Error | null
}

class GetCategoryPresenter implements IGetCategoryUseCaseResponse {
    model_view: GetCategoryModelView = {response: null, error: null};

    success(category: CategoryResponse): void {
        this.model_view.response = { categoryId: category.category_id, title: category.title, icon: category.icon, color: category.color };
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function GET(
    request: Request,
    { params }: { params: {id: string} }
) {
    const id = params.id;

    let presenter = new GetCategoryPresenter();

    let repos = await initRepository()

    let use_case = new GetCategoryUseCase(repos.categoryRepo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, { status: 200});
}

export type ApiDeleteCategoryResponse = {
    is_deleted: boolean
}

type DeleteCategory = {
    response: ApiDeleteCategoryResponse | null,
    error: Error | null
}

class DeleteCategoryPresenter implements IDeleteCategoryUseCaseResponse {
    model_view: DeleteCategory = {response: null, error: null};

    success(is_deleted: boolean): void {
        this.model_view.response = { is_deleted: is_deleted };
        this.model_view.error = null;     
    }

    fail(err: Error): void {
        this.model_view.response = null;
        this.model_view.error = err;
    }    
}

export async function DELETE(
    request: Request,
    { params }: { params: {id: string} }
) {
    const id = params.id;

    let presenter = new DeleteCategoryPresenter();

    let repos = await initRepository()

    let use_case = new DeleteCategoryUseCase(repos.categoryRepo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error !== null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

export type ApiUpdateCategory = {
    is_updated: boolean
}

type UpdateCategoryModelView = {
    response: ApiUpdateCategory | null,
    error: Error | null
}

class UpdateCategoryPresenter implements IDeleteCategoryUseCaseResponse {
    model_view: UpdateCategoryModelView = {response: null, error: null};

    success(is_updated: boolean): void {
        this.model_view.response = { is_updated: is_updated };
        this.model_view.error = null;     
    }

    fail(err: Error): void {
        this.model_view.response = null;
        this.model_view.error = err;
    }    
}

export async function PUT(
    request: Request,
    { params }: { params: {id: string} }
) {
    const id = params.id;

    let category = await request.json();
    let request_category: RequestUpdateCategoryUseCase = category;
    request_category.id = id;

    let presenter = new UpdateCategoryPresenter();

    let repo = await initRepository()

    let use_case = new UpdateCategoryUseCase(repo.categoryRepo, presenter);
    use_case.execute(request_category);

    if (presenter.model_view.error !== null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}