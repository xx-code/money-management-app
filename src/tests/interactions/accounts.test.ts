import { CreationAccountUseCase } from '../../interactions/account/creationAccountUseCase';
import { Crypto } from '../../interactions/utils/cryto';
import { AccountRepository, dbAccount, dbAccountResponse } from '../../interactions/repositories/accountRepository';
import { ValidationError } from '../../interactions/errors/validationError';
import { GetAccountUseCase } from '../../interactions/account/getAccountUseCase';
import { NotFoundError } from '../../interactions/errors/notFoundError';
import { GetAllAccountUseCase } from '../../interactions/account/getAllAccountUseCase';
import { DeleteAccountUseCase } from '../../interactions/account/deleteAccountUseCase';

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
    updated: jest.fn().mockReturnValue({
        id: 'new id',
        title: 'titre value',
        credit_value: 6600,
        credit_limit: 1000,
        balance: 0
    })
}

class MockCrypto implements Crypto {
    generate_uuid_to_string(): string {
        return 'new id';
    }
}


describe('Creation Account Use Case', () => {
    let repo: AccountRepository = {
        save: jest.fn().mockReturnValue('new id'),
        exist: jest.fn().mockReturnValue(false),
        get:jest.fn(),
        get_all:jest.fn(),
        delete: jest.fn(),
        updated: jest.fn()
    };
    
    let crypto = new MockCrypto();

    let use_case = new CreationAccountUseCase(repo, crypto);
    
    it('Test error titel creation', () => {
        try { 
            use_case.execute({
                title: ' ',
                credit_value: 0,
                credit_limit: 0
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Title of account is empty'));
        }
    });

    it('Test error credit value', () => {
        try {
            use_case.execute({
                title: 'value',
                credit_limit: -4,
                credit_value: 0
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Credit limit must be greater than 0'));
        }
    });

    it('Test error credit limit', () => {
        try {
            use_case.execute({
                title: 'value',
                credit_value: -4,
                credit_limit: 0
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Credit value must be greater than 0'));
        }
    });

});

describe('Get Account Use Case', () => {
    let mock_rest: dbAccountResponse = {id: '1', title: 'trr', credit_limit: 0, credit_value: 0, balance: 0};
    let repo: AccountRepository = {
        save: jest.fn(),
        exist: jest.fn().mockReturnValue(false),
        get:jest.fn().mockReturnValue(null),
        get_all:jest.fn().mockReturnValue([mock_rest]),
        delete: jest.fn(),
        updated: jest.fn()
    };
    
    let use_case = new GetAccountUseCase(repo);
    it('Test not found account', () => {
        try {
            use_case.execute('8');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Account Not Found'));
        }
    });

    let use_case2 = new GetAllAccountUseCase(repo);
    it('Test get all account', () => {
        let response = use_case2.execute() ;
        expect(response.length).toBe(1);
    });
});

describe('Delete Account Use case', () => {
    let repo: AccountRepository = {
        save: jest.fn(),
        exist: jest.fn().mockReturnValue(false),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn().mockReturnValue([]),
        delete: jest.fn(),
        updated: jest.fn()
    };

    let use_case = new DeleteAccountUseCase(repo);
    it('Test not found account', () => {
        try {
            use_case.execute('9');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Account Not Found'));
        }
    })
});