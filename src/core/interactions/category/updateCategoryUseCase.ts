import { NotFoundError } from "@/core/errors/notFoundError";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { isEmpty } from "@/core/domains/helpers";

export type RequestUpdateCategoryUseCase = {
    id: string
    title: string | null
    icon: string | null 
    color: string | null
}

export interface IUpdateCategoryUseCase {
    execute(request: RequestUpdateCategoryUseCase): void;
}

export interface IUpdateCategoryUseCaseResponse {
    success(is_updated: boolean): void;
    fail(err: Error): void;
}

export class UpdateCategoryUseCase implements IUpdateCategoryUseCase {
    private repository: CategoryRepository;
    private presenter: IUpdateCategoryUseCaseResponse;

    constructor(repo: CategoryRepository, presenter: IUpdateCategoryUseCaseResponse) {
        this.repository = repo;
        this.presenter = presenter;
    }

    async execute(request: RequestUpdateCategoryUseCase): Promise<void> {
        try {
            let category = await this.repository.get(request.id);
            if (category == null) {
                throw new NotFoundError('Category no found');
            }
           
            if (!isEmpty(request.title))
                category.setTitle(request.title!)

            if (!(isEmpty(request.icon)))
                category.icon = request.icon!

            if (!(isEmpty(request.color)))
                category.color = request.color

            let is_updated = await this.repository.update(category);

            this.presenter.success(is_updated);
        } catch(err) {
            this.presenter.fail(err as Error);
        }
    }
}