import { BudgetRepository } from "../../repositories/budgetRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { CategoryRepository } from "../../repositories/categoryRepository";
import { determinedStartEndDateBudget } from "@/core/domains/helpers";
import { TagRepository } from "@/core/repositories/tagRepository";
import { TransactionType } from "@/core/domains/entities/transaction";


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
   currentBalance: number
   start_date: string
   update_date: string
   end_date: string|null
}


export interface IGetAllBudgetUseCase {
   execute(): void;
}


export interface IGetAllBudgetUseCaseResponse {
   success(budgets: Array<BudgetOutput>): void;
   fail(err: Error): void;
}

export interface IGetAllBudgetAdapter {
    budget_repository: BudgetRepository
    category_repository: CategoryRepository
    tag_repository: TagRepository
    transaction_repository: TransactionRepository
}

export class GetAllBudgetUseCase implements IGetAllBudgetUseCase {
   private budget_repository: BudgetRepository;
   private transaction_repository: TransactionRepository;
   private category_repository: CategoryRepository
   private tag_repository: TagRepository
   private presenter: IGetAllBudgetUseCaseResponse;
  
   constructor(adapters: IGetAllBudgetAdapter, presenter: IGetAllBudgetUseCaseResponse) {
       this.budget_repository = adapters.budget_repository
       this.transaction_repository = adapters.transaction_repository
       this.category_repository = adapters.category_repository
       this.tag_repository = adapters.tag_repository
       this.presenter = presenter;
   }


   async execute(): Promise<void> {
       try {
           let budgets = await this.budget_repository.getAll();
        
           let budgets_display = [];
           for (let i = 0; i < budgets.length; i++) {
               let budget = budgets[i];
              
               let start_date = budget.date_start
               let end_date = budget.date_update

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
                   type: TransactionType.DEBIT,
                   start_date: start_date.toString(),
                   end_date: end_date.toString(),
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

               budgets_display.push(budget_display);
           }
           this.presenter.success(budgets_display)
       } catch(err) {
           this.presenter.fail(err as Error);
       }
   }
}
