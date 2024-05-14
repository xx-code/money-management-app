import { SqlCategoryRepository } from "@/infrastructure/sql/sqlCategoryRepository";
import { SqlAccountRepository } from "../../infrastructure/sql/sqlAccountRepository";
import { SqlTagRepository } from "@/infrastructure/sql/sqlTagRepository";
import { SqlRecordRepository } from "@/infrastructure/sql/sqlRecordRepository";
import { SqlTransactionRepository } from "@/infrastructure/sql/sqlTransactionRepository";
import { SqlBudgetCategoryRepository, SqlBudgetTagRepository } from "@/infrastructure/sql/sqlBudgetRepository";

const DB_FILENAME = process.env.NODE_ENV === 'production' ? 'database.db' : 'testdb.db'; 
const account_repo = new SqlAccountRepository('accounts');
const category_repo = new SqlCategoryRepository('categories');
const tag_repo = new SqlTagRepository('tags');
const record_repo = new SqlRecordRepository('records');
const transaction_repo = new SqlTransactionRepository('transactions');
const budget_categories_repo = new SqlBudgetCategoryRepository('budget_categories');
const budget_tag_repo = new SqlBudgetTagRepository('budget_tags');

export {
    DB_FILENAME,
    account_repo,
    category_repo,
    tag_repo,
    record_repo,
    transaction_repo,
    budget_categories_repo,
    budget_tag_repo
}