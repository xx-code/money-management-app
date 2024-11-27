import { NotFoundError } from "../../errors/notFoundError";
import { BudgetRepository } from "../../repositories/budgetRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { determinedStartEndDateBudget } from "@/core/domains/helpers";
import { TagRepository } from "@/core/repositories/tagRepository";


export type BudgetCategoryOutput = {
   id: string
   title: string
   icon: string
   color: string|null
}


export type BudgetTagOutput = {
   id: string
   title: string
   color: string|null
}


export type BudgetOutput = {
   id: string,
   title: string,
   target: number,
   categories: BudgetCategoryOutput[],
   tags: BudgetTagOutput[]
   period: string|null
   period_time: number
   start_date: string
   currentBalance: number
   update_date: string
   end_date: string|null
}


export interface IGetBudgetUseCase {
   execute(id: string,): void;
}


export interface IGetBudgetUseCaseResponse {
   success(budget: BudgetOutput): void;
   fail(err: Error): void;
}

export interface IGetBudgetAdpater {
    budget_repostiroy: BudgetRepository
    transaction_repository: TransactionRepository
    category_repository: CategoryRepository
    tag_repository: TagRepository
}

export class GetBudgetUseCase implements IGetBudgetUseCase {
   private budget_repository: BudgetRepository;
   private transaction_repository: TransactionRepository;
   private category_repository: CategoryRepository
   private tag_repository: TagRepository
   private presenter: IGetBudgetUseCaseResponse;


   constructor(repo: IGetBudgetAdpater, presenter: IGetBudgetUseCaseResponse) {
       this.budget_repository = repo.budget_repostiroy
       this.presenter = presenter
       this.category_repository = repo.category_repository
       this.transaction_repository = repo.transaction_repository
       this.tag_repository = repo.tag_repository
   }


   async execute(id: string): Promise<void> {
       try {
           let budget = await this.budget_repository.get(id);


           if (budget == null) {
               throw new NotFoundError('Budget not found');
           }


      
           let start_date = budget.date_start;
           let end_date = budget.date_end;
           if (budget.period)  {
               let current_date_budget = determinedStartEndDateBudget(budget.period!, budget.period_time!)
               start_date = current_date_budget.start_date
               end_date = current_date_budget.end_date
               if (budget.date_end && end_date.compare(budget.date_end) < 0)
                   end_date = budget.date_end
           }


           let categories: BudgetCategoryOutput[] =  []
           for(let category_id of budget.categories) {
               let category = await this.category_repository.get(category_id)
               if (category !== null)
                   categories.push({id: category.id, title: category.getTitle(), icon: category.icon, color: category.color})
           }


           let tags: BudgetTagOutput[] = []
           for (let tag_ref of budget.tags) {
               let tag = await this.tag_repository.get(tag_ref)
               if (tag !== null)
                   tags.push({id: tag.id, title: tag.getValue(), color: tag.color })
           }
              
           let balance = await this.transaction_repository.getBalance({
               categories: budget.categories,
               accounts: [],
               tags: budget.tags,
               type: null,
               start_date: start_date.toString(),
               end_date: end_date?.toString(),
               price: null
           });
          
           let budget_display: BudgetOutput = {
               id: budget.id,
               title: budget.title,
               categories: categories,
               currentBalance: Math.abs(balance),
               period: budget.period,
               period_time: budget.period_time,
               target: budget.target.getAmount(),
               start_date: budget.date_start.toString(),
               update_date: budget.date_update.toString(),
               end_date: budget.date_end ? budget.date_end.toString() : null,
               tags: tags
           };


           this.presenter.success(budget_display);
       } catch(err) {
           this.presenter.fail(err as Error);
       }
   }
}
