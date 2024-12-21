import { CreationTagUseCase, ICreationTagUseCaseResponse, RequestCreationTagUseCase } from "@/core/interactions/tag/creationTagUseCase"
import { GetAllTagUseCase, IGetAllTagUseCaseResponse, TagOutput } from "@/core/interactions/tag/getAllTagsUseCase";
import { NextResponse } from "next/server";
import { initRepository } from "../libs/init_repo";
import UUIDMaker from "@/app/services/crypto";
import { TagModel } from "../models/tag";

export type ApiCreationTagResponse = {
    is_saved: boolean
}

type CreationTagModelView = {
    response: ApiCreationTagResponse| null,
    error: Error | null
}

class CreationTagPresenter implements ICreationTagUseCaseResponse {
    model_view: CreationTagModelView = {response: null, error: null};

    success(is_saved: boolean): void {
        this.model_view.response = {is_saved: is_saved}
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
    let request_creation_tag: RequestCreationTagUseCase = await request.json();

    let presenter = new CreationTagPresenter();

    let repo = await initRepository()

    let use_case = new CreationTagUseCase(repo.tagRepo, new UUIDMaker(), presenter);
    await use_case.execute(request_creation_tag);

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}


type GetAllTagModelView = {
    response: TagModel[] | null,
    error: Error | null
}

class GetAllTagPresenter implements IGetAllTagUseCaseResponse {
    model_view: GetAllTagModelView = { response: [], error: null}

    success(tags: TagOutput[]): void {
        this.model_view.response = tags.map(tag => ({tagId: tag.id, title: tag.value, color: tag.color}))
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function GET() {
    let presenter = new GetAllTagPresenter();

    let repo = await initRepository()
    
    let use_case = new GetAllTagUseCase(repo.tagRepo, presenter);
    await use_case.execute();

    if (presenter.model_view.error != null) {
        return new Response(presenter.model_view.error.message, {
            status: 400,
        });
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}