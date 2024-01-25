import { InMemoryAccountRepository } from "../../../infrastructure/inMemory/inMemoryAccountRepository";
import { InMemoryBudgetCategory, InMemoryBudgetTag } from "../../../infrastructure/inMemory/inMemoryBudgetRepository";
import { InMemoryCategoryRepository } from "../../../infrastructure/inMemory/inMemoryCategoryRepository";
import { InMemoryTagRepository } from "../../../infrastructure/inMemory/inMemoryTagRepository";
import { InMemoryTransactionRepository } from "../../../infrastructure/inMemory/inMemoryTransactionRepository";
import { AccountRepository } from "../../../interactions/repositories/accountRepository";
import { BudgetCategoryRepository, BudgetTagRepository } from "../../../interactions/repositories/budgetRepository";
import { CategoryRepository } from "../../../interactions/repositories/categoryRepository";
import { TagRepository } from "../../../interactions/repositories/tagRepository";
import { TransactionRepository } from "../../../interactions/repositories/transactionRepository";

export const tagRepository: TagRepository = new InMemoryTagRepository();
export const categoryRepository: CategoryRepository = new InMemoryCategoryRepository();
export const transactionRepository: TransactionRepository = new InMemoryTransactionRepository(categoryRepository, tagRepository);
export const budgetCategoryRepository: BudgetCategoryRepository = new InMemoryBudgetCategory();
export const budgetTagRepository: BudgetTagRepository = new InMemoryBudgetTag();
export const accountRepository: AccountRepository = new InMemoryAccountRepository(transactionRepository);
