import { SAVING_CATEGORY_ID } from "@/core/domains/constants";
import { AccountRepository } from "../../repositories/accountRepository";
import { SavingRepository } from "../../repositories/savingRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { CryptoService } from "@/core/adapters/libs";
import ValidationError from "@/core/errors/validationError";
import { Transaction } from "@/core/domains/entities/transaction";

export type RequestDeleteSaveGoal = {
    save_goal_ref: string
    account_tranfert_ref: string
}

export interface IDeleteSaveGoalUseCase {
    execute(request: RequestDeleteSaveGoal): void
}

export interface IDeleteSaveGoalPresenter {
    success(isDelete: boolean): void;
    fail(err: Error): void;
}


export class DeleteSaveGoalUseCase implements IDeleteSaveGoalUseCase {
    private transaction_repo: TransactionRepository
    private account_repo: AccountRepository
    private saving_repo: SavingRepository
    private presenter: IDeleteSaveGoalPresenter
    private crypto: CryptoService

    constructor(presenter: IDeleteSaveGoalPresenter, uiid: CryptoService, transaction_repo: TransactionRepository, account_repo: AccountRepository, saving_repo: SavingRepository) {
        this.presenter = presenter
        this.transaction_repo = transaction_repo
        this.account_repo = account_repo
        this.saving_repo = saving_repo

        this.crypto = uiid
    }

    async execute(request: RequestDeleteSaveGoal): Promise<void> {
        try {

            let saving_goal = await this.saving_repo.get(request.save_goal_ref)

            if (saving_goal === null) {
                throw new ValidationError('Saving goal do not exist')
            }

            let account_tranfert = await this.account_repo.get(request.account_tranfert_ref)

            if (account_tranfert === null) {
                throw new ValidationError('Account do not exist')
            }

            let transactions_saving = await this.transaction_repo.getPaginations(-1, 1, null, {
                accounts: [saving_goal.account_ref],
                categories: [],
                tags: [],
                start_date: undefined,
                end_date: undefined,
                price: undefined,
                type: undefined
            })

            // transfert all transaction to recevier account
            for(let trans of transactions_saving.transactions) {
                let transaction = new Transaction(trans.id, SAVING_CATEGORY_ID, account_tranfert.id, trans.record_ref)
                transaction.setTags(trans.getTags())
                await this.transaction_repo.update(transaction)
            }

            await this.account_repo.delete(saving_goal.account_ref)

            await this.saving_repo.delete(saving_goal.id)

        } catch(err: any) {
            this.presenter.fail(err)
        }
    }
}
