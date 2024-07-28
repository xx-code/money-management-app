import { DB_FILENAME, account_repo, category_repo, record_repo, tag_repo, transaction_repo, future_transaction_repo} from "@/app/configs/repository";

export async function initRepository() {
    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);
    await future_transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name)

    return {
        accountRepo: account_repo,
        categoryRepo: category_repo,
        tagRepo: tag_repo,
        recordRepo: record_repo,
        transactionRepo: transaction_repo,
        transactionFutreRepo: future_transaction_repo
    }
}