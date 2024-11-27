import { DeleteTagUseCase, IDeleteTagUseCaseResponse } from "@/core/interactions/tag/deleteTagUseCase"
import { TagOutput } from "@/core/interactions/tag/getAllTagsUseCase"
import { GetTagUseCase, IGetTagUseCaseResponse } from "@/core/interactions/tag/getTagUseCase"
import { NextResponse } from "next/server"
import { initRepository } from "../../libs/init_repo"

export type ApiGetTagResponse = {
    id: string,
    title: string,
    color: string|null
}

type GetTagModelView = {
    response: ApiGetTagResponse | null,
    error: Error | null
}

class GetTagPresenter implements IGetTagUseCaseResponse {
    model_view: GetTagModelView = {response: null, error: null}

    success(tag: TagOutput): void {
        this.model_view.response = {id: tag.id, title: tag.value, color: tag.color}
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
    const id = params.id

    let presenter = new GetTagPresenter();    

    let repos = await initRepository()

    let use_case = new GetTagUseCase(repos.tagRepo, presenter);
    await use_case.execute(id);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

export type ApiDeleteTagResponse = {
    is_deleted: boolean
}

type DeleteTagModelView = {
    response: ApiDeleteTagResponse | null,
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
    { params }: {params: {id: string}}
) {
    const id = params.id;
    let presenter = new DeleteTagPresenter();

    let repo = await initRepository()

    let use_case = new DeleteTagUseCase(repo.tagRepo, presenter);
    use_case.execute(id);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200})
}