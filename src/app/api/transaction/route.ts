import { DB_FILENAME, account_repo, category_repo, record_repo, tag_repo, transaction_repo } from "@/app/configs/repository";
import DateParser from "@/core/entities/date_parser";
import { Transaction, TransactionType, is_Transaction_type } from "@/core/entities/transaction";
import { is_empty } from "@/core/entities/verify_empty_value";
import { AddTransactionUseCase, IAddTransactionUseCaseResponse, RequestAddTransactionUseCase } from "@/core/interactions/transaction/addTransactionUseCase"
import { GetPaginationTransaction, IGetPaginationTransactionResponse, RequestGetPagination, TransactionResponse } from "@/core/interactions/transaction/getPaginationTransactionUseCase";
import UUIDMaker from "@/services/crypto";
import { NextRequest, NextResponse } from "next/server";

type AddTransactionModelView = {
    response: {id_transaction: string} | null,
    error: Error | null
}

class AddTransactionPresenter implements IAddTransactionUseCaseResponse {
    model_view: AddTransactionModelView = {response: null, error: null};

    success(id_transaction: string): void {
        this.model_view.response = {id_transaction: id_transaction};
        this.model_view.error = null;
    }
    fail(err: Error): void {
        this.model_view.error = err;
        this.model_view.response = null;
    }
}

export async function POST(
    request: Request
) {
    let new_transaction = await request.json();

    // TODO Make all transaction transation request transformation in date
    if (is_empty(new_transaction.date)) {
        return new Response(
            'Date field is empty',
            {status: 400}
        );
    }

    if (is_empty(new_transaction.type)) {
        return new Response(
            'Type field is empty',
            {status: 400}
        )
    }
   
    const type = new_transaction.type[0].toUpperCase() + new_transaction.type.slice(1)
    if (!is_Transaction_type(type)) {
        return new Response(
            'You have to select Credit or Debit Transactions',
            {status: 400}
        );
    }

    let date = new Date(new_transaction.date);

    let request_new_transaction: RequestAddTransactionUseCase = {
        account_ref: new_transaction.account_ref,
        tag_ref: new_transaction.tag_ref,
        category_ref: new_transaction.category_ref,
        description: new_transaction.description,
        price: new_transaction.price,
        type: type,
        date: new DateParser(date.getFullYear(), date.getMonth() + 1, date.getDate())
    }

    let uuid = new UUIDMaker(); 

    let presenter = new AddTransactionPresenter();

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);

    let use_case = new AddTransactionUseCase(transaction_repo, record_repo, category_repo, tag_repo, account_repo, uuid, presenter);
    await use_case.execute(request_new_transaction);

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}