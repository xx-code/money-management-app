import { NextResponse } from 'next/server';
import { CreationCategoryUseCase, RequestCreationCategoryUseCase, ICreationCategoryUseCaseResponse } from '../../../core/interactions/category/creationCategoryUseCase';
import { DB_FILENAME, category_repo } from '../../configs/repository';
import { GetAllCategoryUseCase, IGetAllCategoryUseCaseResponse } from '@/core/interactions/category/getAllCategoryUseCase';
import { Category } from '@/core/entities/category';
import UUIDMaker from '@/services/crypto';

type CreationCategoryModelView = {
    response: {is_saved: boolean} | null,
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

    await category_repo.init(DB_FILENAME);

    let use_case = new CreationCategoryUseCase(category_repo, presenter, uuid);
    await use_case.execute(request_category);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type GetAllCategoryModelView = {
    response : {categories: Category[]},
    error: Error | null
}

class GetAllCategoryPresenter implements IGetAllCategoryUseCaseResponse {
    model_view: GetAllCategoryModelView = {response: {categories: []}, error: null};

    success(categories: Category[]): void {
        this.model_view.response = { categories: categories };
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = { categories: [] };
    }
}

export async function GET() {
    let presenter = new GetAllCategoryPresenter();

    await category_repo.init(DB_FILENAME);

    let use_case = new GetAllCategoryUseCase(category_repo, presenter);
    await use_case.execute();

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}