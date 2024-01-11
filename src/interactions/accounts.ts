import { Account } from '../entities/account';
import { Transaction } from '../entities/transaction';

export interface AccountGateaway {
    save_account(request: RequestCreationDsAccount): ResponseAccount;
    get_all_account(): Array<ResponseAccount>;
    get_account(id: string): ResponseAccount;

}

export interface AccountPresenter {
    get_account(account: ResponseAccount): void;
    get_all_account(accounts: Array<ResponseAccount>): void;
}

export class RequestCreationAccount {
    account_name: string = '';
    account_credit_value: number = 0;
    account_limit_value: number = 0;
    account_init_transaction: number|null = null;

    constructor(name:string, credit_value:number, account_limit: number, init_trans:number|null) {
        this.account_name = name;
        this.account_credit_value = credit_value;
        this.account_init_transaction = init_trans;
        if (init_trans !== null) {
            this.account_limit_value = account_limit;
        }
    }
}

export class RequestCreationDsAccount {
    id: string = '';
    account_name: string = '';
    account_credit_value: number = 0;
    account_init_transaction: number = 0;

    constructor(id:string, request_creation_account:RequestCreationAccount) {
        this.id = id;
        this.account_name = request_creation_account.account_name;
        this.account_credit_value = request_creation_account.account_credit_value;

        if (request_creation_account.account_init_transaction !== null) {
            this.account_init_transaction = request_creation_account.account_init_transaction;
        }
    }
}

export class ResponseAccount {
    id: string|null = null;
    account_name: string|null = null;
    account_balance: number|null = null;

    constructor(id:string|null=null, account_name:string|null=null, account_balance:number|null=null) {
        this.id = id;
        this.account_name = account_name;
        this.account_balance = account_balance;
    }
}

export class AccountUseCase {
    private register: AccountGateaway;
    private presenter: AccountPresenter;
    
    constructor(register: AccountGateaway, presenter: AccountPresenter) {
        this.register = register;
        this.presenter = presenter;
    }

    create_new_account(request: RequestCreationAccount) {
        return 
    }

    get_account(id: string) {

    }

    get_all_accounts() {

    }

    delete_account(id: string) {

    }

}