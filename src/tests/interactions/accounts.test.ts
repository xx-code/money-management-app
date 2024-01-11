import { AccountUseCase, AccountGateaway, AccountPresenter, RequestCreationDsAccount, RequestCreationAccount, ResponseAccount } from '../../interactions/accounts'; 

class MockAccountRegister implements AccountGateaway {
    arr = new Map<string, ResponseAccount>();

    save_account(request: RequestCreationDsAccount): ResponseAccount {
        let res = new ResponseAccount(
            request.id,
            request.account_name,
            request.account_init_transaction
        );
        this.arr.set(request.id, res);
        return res
    }

    get_account(id: string): ResponseAccount {
        return this.arr.get(id)!;
    }

    get_all_account(): ResponseAccount[] {
        let results = [];

        for (let val of this.arr.values()) {
            results.push(val);
        }

        return results;
    }
}

class MockPresenter implements AccountPresenter {
    get_account(account: ResponseAccount){
        return account;     
    }

    get_all_account(accounts: ResponseAccount[]) {
        return accounts;
    }
}

describe('Test interactions creation new account ', () => {
    let register = new MockAccountRegister();
    let presenter = new MockPresenter();

    let account = new AccountUseCase(register, presenter);
    test('creation accounts with base transaction', () => {
        let request = new RequestCreationAccount(
            "Base",
            6600,
            1500,
            2000
        );

        let true_response = new ResponseAccount('0', 'Base', 2000);
        let response = account.create_new_account(request);

        expect(true_response.account_balance, response.account_balance);
        expect(true_response.account_name, response.account_name);
    });

    test('creation account without base transaction', () => {
        let request = new RequestCreationAccount(
            "Base",
            6600,
            0,
            null
        );

        let true_response = new ResponseAccount('0', 'Base', 0);

        let response = account.create_new_account(request);

        expect(true_response.account_balance, response.account_balance);
        expect(true_response.account_name, response.account_name);
    });
})