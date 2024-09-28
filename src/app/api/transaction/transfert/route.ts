import { DB_FILENAME, account_repo, category_repo, record_repo, tag_repo, transaction_repo } from "@/app/configs/repository";
import DateParser from "@/core/entities/date_parser";
import { is_Transaction_type } from "@/core/entities/transaction";
import { is_empty } from "@/core/entities/verify_empty_value";
import { TransfertTransactionUseCase, ITransfertTransactionUseCaseResponse, RequestTransfertTransactionUseCase } from "@/core/interactions/transaction/transfertTransactionUseCase"
import UUIDMaker from "@/services/crypto";
import { NextRequest, NextResponse } from "next/server";

type TransfertTransactionModelView = {
    response: {is_transfert: boolean} | null,
    error: Error | null
}

class AddTransactionPresenter implements ITransfertTransactionUseCaseResponse {
    model_view: TransfertTransactionModelView = {response: null, error: null};

    success(is_transfert: boolean): void {
        this.model_view.response = {is_transfert: is_transfert};
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


    let request_new_transaction: RequestTransfertTransactionUseCase = {
        account_id_from: new_transaction.account_id_from,
        account_id_to: new_transaction.account_id_to,
        price: new_transaction.price,
        date: DateParser.from_string(new_transaction.date)
    }

    let uuid = new UUIDMaker(); 

    let presenter = new AddTransactionPresenter();

    await account_repo.init(DB_FILENAME);
    await category_repo.init(DB_FILENAME);
    await tag_repo.init(DB_FILENAME);
    await record_repo.init(DB_FILENAME);
    await transaction_repo.init(DB_FILENAME, account_repo.table_account_name, category_repo.table_category_name, tag_repo.table_tag_name, record_repo.table_record_name);

    let use_case = new TransfertTransactionUseCase(transaction_repo, presenter, account_repo, category_repo, tag_repo, record_repo, uuid);
    await use_case.execute(request_new_transaction);

    if (presenter.model_view.error != null) {
        return new Response(
            presenter.model_view.error.message,
            {status: 400}
        )
    }

    return NextResponse.json(presenter.model_view.response, {status: 200});
}