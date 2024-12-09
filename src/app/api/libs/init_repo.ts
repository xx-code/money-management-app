import { SqlLiteConnection } from "@/infrastructure/sql/sql_lite_connector";
import { SqlLiteAccount } from "@/infrastructure/sql/sqlAccountRepository";
import { SqlLiteBudget } from "@/infrastructure/sql/sqlBudgetRepository";
import { SqlLitecategory } from "@/infrastructure/sql/sqlCategoryRepository";
import { SqlLiteRecord } from "@/infrastructure/sql/sqlRecordRepository";
import { SqlLiteSaving } from "@/infrastructure/sql/sqlSavingRepository";
import { SqlLiteTag } from "@/infrastructure/sql/sqlTagRepository";
import { SqlLiteTransaction } from "@/infrastructure/sql/sqlTransactionRepository";

export async function initRepository() {
    let sql_lite = await SqlLiteConnection.getInstance()

    const account_repo = new SqlLiteAccount();
    await account_repo.init(sql_lite)
    const category_repo = new SqlLitecategory();
    await category_repo.init(sql_lite)
    const tag_repo = new SqlLiteTag();
    await tag_repo.init(sql_lite)
    const record_repo = new SqlLiteRecord();
    await record_repo.init(sql_lite)
    const transaction_repo = new SqlLiteTransaction()
    await transaction_repo.init(sql_lite)
    const budget_repo = new SqlLiteBudget()
    await budget_repo.init(sql_lite)
    const saving_repo = new SqlLiteSaving()
    await saving_repo.init(sql_lite)

    return {
        accountRepo: account_repo,
        categoryRepo: category_repo,
        tagRepo: tag_repo,
        recordRepo: record_repo,
        transactionRepo: transaction_repo,
        budgetRepo: budget_repo,
        savingRepo: saving_repo
    }
}