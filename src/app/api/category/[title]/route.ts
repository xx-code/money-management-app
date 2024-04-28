import { DB_FILENAME, category_repo } from "@/app/configs/repository";
import { Category } from "@/core/entities/category"
import { DeleteCategoryUseCase, IDeleteCategoryUseCaseResponse } from "@/core/interactions/category/deleteCategoryUseCase";
import { GetCategoryUseCase, IGetCategoryUseCaseResponse } from "@/core/interactions/category/getCategoryUseCase"
import { NextResponse } from "next/server";

type GetCategoryModelView = {
    response: { title: string, icon: string } | null,
    error: Error | null
}

class GetCategoryPresenter implements IGetCategoryUseCaseResponse {
    model_view: GetCategoryModelView = {response: null, error: null};

    success(category: Category): void {
        this.model_view.response = { title: category.title, icon: category.icon };
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function GET(
    request: Request,
    { params }: { params: {title: string} }
) {
    const title = params.title;

    let presenter = new GetCategoryPresenter();

    await category_repo.init(DB_FILENAME);

    let use_case = new GetCategoryUseCase(category_repo, presenter);
    await use_case.execute(title);

    if (presenter.model_view.error !== null) {
        console.log(presenter.model_view.error.message);
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, { status: 200});
}

type DeleteCategory = {
    response: {is_deleted: boolean} | null,
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
    { params }: { params: {title: string} }
) {
    const title = params.title;

    let presenter = new DeleteCategoryPresenter();

    await category_repo.init(DB_FILENAME);

    let use_case = new DeleteCategoryUseCase(category_repo, presenter);
    await use_case.execute(title);

    if (presenter.model_view.error !== null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}