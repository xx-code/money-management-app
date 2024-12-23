import { BudgetRepository } from "../../repositories/budgetRepository";
import { CryptoService } from "../../adapters/libs";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { TagRepository } from "../../repositories/tagRepository";
import { BudgetBuilder } from "@/core/domains/entities/budget";
import { DateParser, determinedEndDateWith, isEmpty, Money } from "@/core/domains/helpers";
import ValidationError from "@/core/errors/validationError";
import { Tag } from "@/core/domains/entities/tag";
import { mapperPeriod } from "@/core/domains/constants";

export type RequestCreationBudgetUseCase = {
    title: string;
    target: number;
    period: string;
    period_time: number;
    date_start: string;
    date_end: string;
    categories_ref: string[]
    tags_ref: string[]
    new_tags_ref: string[]
} 

export interface ICreationBudgetUseCase {
    execute(request: RequestCreationBudgetUseCase): void;
}

export interface ICreationBudgetUseCaseResponse {
    success(is_save: boolean): void;
    fail(err: Error): void;
}

export interface ICreationBudgetAdapter {
    budget_repository: BudgetRepository
    category_repository: CategoryRepository
    tag_repository: TagRepository
    crypo: CryptoService
}

export class CreationBudgetUseCase implements ICreationBudgetUseCase {
    private budget_repository: BudgetRepository;
    private category_repository: CategoryRepository;
    private tag_repository: TagRepository;
    private presenter: ICreationBudgetUseCaseResponse;
    private crypto: CryptoService;

    constructor(adapters: ICreationBudgetAdapter, presenter: ICreationBudgetUseCaseResponse) {
        this.budget_repository = adapters.budget_repository;
        this.category_repository = adapters.category_repository;
        this.tag_repository = adapters.tag_repository;
        this.presenter = presenter;
        this.crypto = adapters.crypo
    }

    async execute(request: RequestCreationBudgetUseCase): Promise<void> {
        try {
            const budget_builder = new BudgetBuilder()
 
 
            if (isEmpty(request.title)) {
                throw new ValidationError('Title field is empty');
            }
            budget_builder.setTitle(request.title)
 
 
            if (request.categories_ref.length === 0 && request.tags_ref.length === 0) {
                throw new ValidationError('Budget must have at least a tag or category');
            }
           
            let categories = []
            for (let i = 0; i < request.categories_ref.length; i++) {
                let category = await this.category_repository.get(request.categories_ref[i]);
                if (category === null) {
                    throw new ValidationError('Category ' + request.categories_ref[i] + ' not exist')
                }
                categories.push(category.id);
            }
            budget_builder.setCategories(categories)
 
 
            let tags = [];
            for (let tag_ref of request.tags_ref) {
                let tag = await this.tag_repository.get(tag_ref)
                if (tag === null)
                    throw new ValidationError('The tag in budget do not exist')
                tags.push(tag.id)
            }
 
 
            for (let new_tag of request.new_tags_ref) {
                let id_tag = this.crypto.generate_uuid_to_string()
                let is_tag_saved = await this.tag_repository.save(new Tag(id_tag, new_tag, null))
                if (!is_tag_saved)
                    throw new ValidationError('Error while try saving new tag in budget')
                tags.push(id_tag)
            }
            budget_builder.setTags(tags)
 
 
            if (isEmpty(request.date_start)) {
                throw new ValidationError('Date start is empty')
            }
            let date_start: DateParser = DateParser.fromString(request.date_start)
            budget_builder.setDateStart(date_start)           
           
            if (request.target <= 0) 
                throw new ValidationError("Target must be greater than 0")

            budget_builder.setTarget(new Money(request.target))
 
 
            if (!isEmpty(request.date_end)) {
                let date_end: DateParser = DateParser.fromString(request.date_start)
                budget_builder.setDateEnd(date_end)
            }
           
            // refactoring
            if (!isEmpty(request.period)) {
                let period = mapperPeriod(request.period)
                budget_builder.setPeriod(period)
                
                if (request.period_time <= 0) {
                    throw new ValidationError('Period time must be greater than 0')
                }
                budget_builder.setPeriodTime(request.period_time)

                let date_to_update = determinedEndDateWith(date_start.toDate(), period, request.period_time)
                budget_builder.setDateUpdate(date_to_update)
            } else {
                if (isEmpty(request.date_end)) {
                    throw new ValidationError('this format of budget is impossible set at less a date end')
                }
                let date_end: DateParser = DateParser.fromString(request.date_end)
                budget_builder.setDateUpdate(date_end)
            }
           
            let new_id = this.crypto.generate_uuid_to_string();
            budget_builder.setId(new_id)
 
 
            let new_budget = budget_builder.getBudget()
 
 
            let response = await this.budget_repository.save(new_budget!);
 
 
            this.presenter.success(response);
        } catch(err) {
            this.presenter.fail(err as Error);
        } 
    }
}