import { NextResponse } from 'next/server';
import { CreationCategoryUseCase, RequestCreationCategoryUseCase, ICreationCategoryUseCaseResponse } from '../../../core/interactions/category/creationCategoryUseCase';
import { CategoryResponse, GetAllCategoryUseCase, IGetAllCategoryUseCaseResponse } from '@/core/interactions/category/getAllCategoryUseCase';
import UUIDMaker from '@/app/services/crypto';
import { initRepository } from '../libs/init_repo';
import { CategoryModel } from '../models/categories';

export type ApiCreationCategoryResponse = {
    is_saved: boolean
}

type CreationCategoryModelView = {
    response: ApiCreationCategoryResponse | null,
    error: Error | null
}

class CreationCategoryPresenter implements ICreationCategoryUseCaseResponse {
    model_view: CreationCategoryModelView = { response: null, error: null };

    success(is_saved: boolean): void {
        this.model_view.response = { is_saved: is_saved };
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
    
    let request_category: RequestCreationCategoryUseCase = await request.json();

    let presenter = new CreationCategoryPresenter();

    let repos = await initRepository()

    let use_case = new CreationCategoryUseCase(repos.categoryRepo, presenter, uuid);
    await use_case.execute(request_category);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}


type GetAllCategoryModelView = {
    response : CategoryModel[],
    error: Error | null
}

class GetAllCategoryPresenter implements IGetAllCategoryUseCaseResponse {
    model_view: GetAllCategoryModelView = {response: [], error: null};

    success(categories: CategoryResponse[]): void {
        let res_categories: CategoryModel[] = []
        for (let category of categories) {
            res_categories.push({categoryId: category.category_id, title: category.title, icon: category.icon, color: category.color})
        }
        this.model_view.response = res_categories
        this.model_view.error = null
    }
    fail(err: Error): void {
        this.model_view.error = err
        this.model_view.response = []
    }
}

export async function GET() {
    let presenter = new GetAllCategoryPresenter();

    let repos = await initRepository()

    let use_case = new GetAllCategoryUseCase(repos.categoryRepo, presenter);
    await use_case.execute();

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}