import { CreationAccountUseCase, ICreationAccountUseCaseResponse } from '../../core/interactions/account/creationAccountUseCase';
import { CryptoService } from '../../core/adapters/libs';
import { AccountRepository } from '../../core/repositories/accountRepository';
import { ValidationError } from '../../core/errors/validationError';
import { GetAccountUseCase, IGetAccountUseCaseResponse } from '../../core/interactions/account/getAccountUseCase';
import { NotFoundError } from '../../core/errors/notFoundError';
import { GetAllAccountUseCase, IGetAllAccountUseCaseResponse } from '../../core/interactions/account/getAllAccountUseCase';
import { DeleteAccountUseCase, IDeleteAccountUseCaseResponse } from '../../core/interactions/account/deleteAccountUseCase';
import { Account } from '@/core/entities/account';
import { TransactionRepository, dbFilter } from '@/core/repositories/transactionRepository';

const replyRepositoryMock: AccountRepository = {
    save: jest.fn().mockReturnValue('new id'),
    exist: jest.fn().mockReturnValue(false),
    get: jest.fn().mockReturnValue({
            id: 'new id',
            title: 'titre value',
            credit_value: 6600,
            credit_limit: 1000,
            balance: 0}),
    get_all: jest.fn().mockReturnValue(
        [
            {
                id: 'new id',
                title: 'titre value',
                credit_value: 6600,
                credit_limit: 1000,
                balance: 0
            },
            {
                id: 'new id',
                title: 'titre value',
                credit_value: 6600,
                credit_limit: 1000,
                balance: 0
            }   
        ]
    ),
    delete: jest.fn().mockReturnValue(true),
    update: jest.fn().mockReturnValue({
        id: 'new id',
        title: 'titre value',
        credit_value: 6600,
        credit_limit: 1000,
        balance: 0
    })
}

class MockCrypto implements CryptoService {
    generate_uuid_to_string(): string {
        return 'new id';
    }
}


describe('Creation Account Use Case', () => {
    let repo: AccountRepository = {
        save: jest.fn().mockReturnValue('new id'),
        exist: jest.fn().mockReturnValue(false),
        get:jest.fn().mockReturnValue(Promise.resolve(null)),
        get_all:jest.fn(),
        delete: jest.fn(),
        update: jest.fn()
    };
    
    let crypto = new MockCrypto();
    let presenter: ICreationAccountUseCaseResponse = {
        success: jest.fn().mockReturnValue('new_id'),
        fail: jest.fn().mockReturnValue(new ValidationError('Account name already exist'))
    }

    let use_case = new CreationAccountUseCase(repo, crypto, presenter);
    
    it('Test error title creation', async () => {
        await use_case.execute({
            title: ' ',
            credit_value: 0,
            credit_limit: 0
        });
        expect(presenter.fail).toHaveBeenCalled()
        /*try { 
            use_case.execute({
                title: ' ',
                credit_value: 0,
                credit_limit: 0
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Title of account is empty'));
        }*/
    });

    it('Test error credit value', async () => {
        await use_case.execute({
            title: 'value',
            credit_limit: -4,
            credit_value: 0
        });
        expect(presenter.fail).toHaveBeenCalled()
        /*try {
            use_case.execute({
                title: 'value',
                credit_limit: -4,
                credit_value: 0
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Credit limit must be greater than 0'));
        }*/
    });

    it('Test error credit limit', async () => {
        await use_case.execute({
            title: 'value',
            credit_value: -4,
            credit_limit: 0
        });
        expect(presenter.fail).toHaveBeenCalled()
        /*try {
            use_case.execute({
                title: 'value',
                credit_value: -4,
                credit_limit: 0
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Credit value must be greater than 0'));
        }*/
    });

});

describe('Get Account Use Case', () => {
    let mock_rest: Account = {id: '1', title: 'trr', credit_limit: 0, credit_value: 0};
    let repo: AccountRepository = {
        save: jest.fn(),
        exist: jest.fn().mockReturnValue(false),
        get:jest.fn().mockReturnValue(new Promise((resolve, reject) => {resolve(null)}) ),
        get_all:jest.fn().mockReturnValue([mock_rest]),
        delete: jest.fn(),
        update: jest.fn()
    };

    let repo_transaction: TransactionRepository = {
        save: jest.fn(),
        get: jest.fn(),
        get_account_balance: jest.fn().mockReturnValue(0),
        get_paginations: jest.fn(),
        get_transactions_by_categories: jest.fn(),
        get_transactions_by_tags: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        get_balance: jest.fn()
    }

    let presenter: IGetAccountUseCaseResponse = {
        success: jest.fn().mockReturnValue(mock_rest),
        fail: jest.fn().mockReturnValue(new ValidationError('Account name already exist'))
    }
    
    let use_case = new GetAccountUseCase(repo, repo_transaction, presenter);
    it('Test not found account', async () => {
        await use_case.execute("Dvvd");
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('8');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Account Not Found'));
        }*/
    });

    let presenter2: IGetAllAccountUseCaseResponse = {
        success: jest.fn().mockReturnValue([mock_rest]),
        fail: jest.fn().mockReturnValue(new ValidationError('Error'))
    }

    let use_case2 = new GetAllAccountUseCase(repo, repo_transaction, presenter2);
    it('Test get all account', async () => {
        await use_case2.execute() ;
        expect(presenter2.success).toHaveBeenCalled()
    });
});

describe('Delete Account Use case', () => {
    let repo: AccountRepository = {
        save: jest.fn(),
        exist: jest.fn().mockReturnValue(false),
        get:jest.fn().mockReturnValue(Promise.resolve(null)),
        get_all: jest.fn().mockReturnValue([]),
        delete: jest.fn(),
        update: jest.fn()
    };

    let presenter: IDeleteAccountUseCaseResponse = {
        success: jest.fn().mockReturnValue("Dffd"),
        fail: jest.fn().mockReturnValue(new ValidationError('Account name already exist'))
    }

    let use_case = new DeleteAccountUseCase(repo, presenter);
    it('Test not found account', async () => {
        await use_case.execute("Dvvd");
        expect(presenter.fail).toHaveBeenCalled()
    });
});