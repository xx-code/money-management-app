import { DB_FILENAME, tag_repo } from "@/app/configs/repository"
import { DeleteTagUseCase, IDeleteTagUseCaseResponse } from "@/core/interactions/tag/deleteTagUseCase"
import { GetTagUseCase, IGetTagUseCaseResponse } from "@/core/interactions/tag/getTagUseCase"
import { NextResponse } from "next/server"

type GetTagModelView = {
    response: {tag: string} | null,
    error: Error | null
}

class GetTagPresenter implements IGetTagUseCaseResponse {
    model_view: GetTagModelView = {response: null, error: null}

    success(tag: string): void {
        this.model_view.response = {tag: tag};
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function GET(
    request: Request,
    { params }: {params: {title: string}}
) {
    const title = params.title;

    let presenter = new GetTagPresenter();    

    await tag_repo.init(DB_FILENAME);

    let use_case = new GetTagUseCase(tag_repo, presenter);
    await use_case.execute(title);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type DeleteTagModelView = {
    response: {is_deleted: boolean} | null,
    error: Error | null
}

class DeleteTagPresenter implements IDeleteTagUseCaseResponse {
    model_view: DeleteTagModelView = {response: null, error: null}

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
    { params }: {params: {title: string}}
) {
    const title = params.title;
    let presenter = new DeleteTagPresenter();

    await tag_repo.init(DB_FILENAME);

    let use_case = new DeleteTagUseCase(tag_repo, presenter);
    use_case.execute(title);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200})
}