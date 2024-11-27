import { NotFoundError } from "../../errors/notFoundError";
import { BudgetRepository } from "../../repositories/budgetRepository";
import { TagRepository } from "../../repositories/tagRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { DateParser, determinedEndDateWith, isEmpty, Money } from "@/core/domains/helpers";
import ValidationError from "@/core/errors/validationError";
import { mapperPeriod } from "@/core/domains/constants";
import { Tag } from "@/core/domains/entities/tag";
import { CryptoService } from "@/core/adapters/libs";


export type RequestUpdateBudget = {
   id: string
   title: string|null
   target: number|null
   is_archived: boolean|null
   date_start: string|null
   date_end: string|null
   period: string|null
   period_time: number|null
   tags: string[]|null
   new_tags: string[]|null
   categories: string[]|null
}

export interface IUpdateBudgetUseCase {
   execute(request: RequestUpdateBudget): void
}


export interface IUpdateBudgetUseCasePresenter {
   success(success: boolean): void;
   fail(err: Error): void;
}

export interface IUpdateBudgetAdapter { 
    budget_repository: BudgetRepository
    category_repository: CategoryRepository
    tag_repository: TagRepository
    crypto: CryptoService
}

export class UpdateBudgetUseCase implements IUpdateBudgetUseCase {
   private budget_repository: BudgetRepository;
   private category_repository: CategoryRepository;
   private tag_repository: TagRepository;
   private crypto: CryptoService
   private presenter: IUpdateBudgetUseCasePresenter;


   constructor(repo: IUpdateBudgetAdapter, presenter: IUpdateBudgetUseCasePresenter) {
       this.budget_repository = repo.budget_repository
       this.tag_repository = repo.tag_repository
       this.category_repository = repo.category_repository
       this.crypto = repo.crypto
       this.presenter = presenter
   }


   async execute(request: RequestUpdateBudget): Promise<void> {
       try {
           let budget = await this.budget_repository.get(request.id);


           if (budget == null) {
               throw new NotFoundError('Budget not found');
           }


           if (!isEmpty(request.title)) {
               budget.title = request.title!
           }


           if (!isEmpty(request.target)) {
               budget.target = new Money(request.target!)
           }


           if (!isEmpty(request.period_time)) {
               budget.period_time = request.period_time!
           }

           if (!isEmpty(request.is_archived)) {
               budget.is_archived = request.is_archived!
           }

           if (!isEmpty(request.date_start)) {
                let date_start: DateParser = DateParser.fromString(request.date_start!)
                budget.date_start = date_start
           }
            


           if (!isEmpty(request.categories != null)) {
               for (let category_ref of budget.categories) {
                   if (!request.categories!.includes(category_ref))
                       budget.deleteCategory(category_ref)
               }


               for (let category_ref of request.categories!) {
                   let category = await this.category_repository.get(category_ref);
                   if (category == null)
                       throw new ValidationError('This category not exist');

                   if (!budget.categories.includes(category_ref))
                       budget.addCategory(category_ref)
               }
           }


           if (!isEmpty(request.tags)) {
                for(let tag_ref of budget.tags) {
                    if (!request.tags!.includes(tag_ref))
                        budget.deleteTag(tag_ref)
                }

                for (let tag_ref of request.tags!){
                    let tag = await this.tag_repository.get(tag_ref)

                    if (tag == null)
                        throw new ValidationError('This tag not exist');

                    if (!budget.tags.includes(tag_ref))
                        budget.addTag(tag_ref)
                }
           }

           if (!isEmpty(request.new_tags)) {
                for (let new_tag of request.new_tags!) {
                    let id_new_tag = this.crypto.generate_uuid_to_string()
                    let is_save_tag = await this.tag_repository.save(new Tag(id_new_tag, new_tag, null))
                    if (!is_save_tag)
                        throw new ValidationError('Error while saving tag in update budget')
                }
           }
         
           if (!isEmpty(request.date_end)) {
               let date_end = DateParser.fromString(request.date_end!)
               budget.date_end = date_end
           }

           // refactoring
           if (!isEmpty(request.period)) {
                let period = mapperPeriod(request.period!)
                let date_to_update = determinedEndDateWith(budget.date_start.toDate(), period, budget.period_time)
                budget.date_update = date_to_update
            } else {
                if (isEmpty(request.date_end)) {
                    throw new ValidationError('this format of budget is impossible set at less a date end')
                }
                let date_end: DateParser = DateParser.fromString(request.date_start!)
                budget.date_update = date_end
            }
          
           let is_update = await this.budget_repository.update(budget);

           this.presenter.success(is_update);
       } catch(err) {
           this.presenter.fail(err as Error);
       }
   }
}
