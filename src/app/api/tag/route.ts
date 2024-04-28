import { DB_FILENAME, tag_repo } from "@/app/configs/repository";
import { Tag } from "@/core/entities/tag";
import { CreationTagUseCase, ICreationTagUseCaseResponse } from "@/core/interactions/tag/creationTagUseCase"
import { GetAllTagUseCase, IGetAllTagUseCaseResponse } from "@/core/interactions/tag/getAllTagsUseCase";
import { NextResponse } from "next/server";

type CreationTagModelView = {
    response: {title: string} | null,
    error: Error | null
}

class CreationTagPresenter implements ICreationTagUseCaseResponse {
    model_view: CreationTagModelView = {response: null, error: null};

    success(title: string): void {
        this.model_view.response = { title: title };
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.response = null;
        this.model_view.error = err;
    }
}

export async function POST(
    request: Request
) {
    let request_creation_tag: {title: string} = await request.json();

    let presenter = new CreationTagPresenter();

    await tag_repo.init(DB_FILENAME);

    let use_case = new CreationTagUseCase(tag_repo, presenter);
    await use_case.execute(request_creation_tag.title);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}

type GetAllTagModelView = {
    response: { tags: string[] } | null,
    error: Error | null
}

class GetAllTagPresenter implements IGetAllTagUseCaseResponse {
    model_view: GetAllTagModelView = { response: {tags: []}, error: null}

    success(tags: Tag[]): void {
        this.model_view.response = { tags: tags };
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function GET() {
    let presenter = new GetAllTagPresenter();

    await tag_repo.init(DB_FILENAME);
    
    let use_case = new GetAllTagUseCase(tag_repo, presenter);
    await use_case.execute();

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}