import { CreationAccountUseCase, ICreationAccountUseCaseResponse } from '../../core/interactions/account/creationAccountUseCase';
import { CryptoService } from '../../core/adapter/libs';
import { AccountRepository } from '../../core/interactions/repositories/accountRepository';
import { ValidationError } from '../../core/errors/validationError';
import { GetAccountUseCase, IGetAccountUseCaseResponse } from '../../core/interactions/account/getAccountUseCase';
import { NotFoundError } from '../../core/errors/notFoundError';
import { GetAllAccountUseCase, IGetAllAccountUseCaseResponse } from '../../core/interactions/account/getAllAccountUseCase';
import { DeleteAccountUseCase, IDeleteAccountUseCaseResponse } from '../../core/interactions/account/deleteAccountUseCase';
import { Account } from '@/core/entities/account';

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

class MockCrypto implements CryptoService {
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
    let presenter: ICreationAccountUseCaseResponse = {
        success: jest.fn().mockReturnValue('new_id'),
        fail: jest.fn().mockReturnValue(new ValidationError('Account name already exist'))
    }

    let use_case = new CreationAccountUseCase(repo, crypto, presenter);
    
    it('Test error title creation', () => {
        use_case.execute({
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

    it('Test error credit value', () => {
        use_case.execute({
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

    it('Test error credit limit', () => {
        use_case.execute({
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
        get:jest.fn().mockReturnValue(null),
        get_all:jest.fn().mockReturnValue([mock_rest]),
        delete: jest.fn(),
        updated: jest.fn()
    };

    let presenter: IGetAccountUseCaseResponse = {
        success: jest.fn().mockReturnValue(mock_rest),
        fail: jest.fn().mockReturnValue(new ValidationError('Account name already exist'))
    }
    
    let use_case = new GetAccountUseCase(repo, presenter);
    it('Test not found account', () => {
        use_case.execute("Dvvd");
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

    let use_case2 = new GetAllAccountUseCase(repo, presenter2);
    it('Test get all account', () => {
        use_case2.execute() ;
        expect(presenter2.success).toHaveBeenCalled()
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

    let presenter: IDeleteAccountUseCaseResponse = {
        success: jest.fn().mockReturnValue("Dffd"),
        fail: jest.fn().mockReturnValue(new ValidationError('Account name already exist'))
    }

    let use_case = new DeleteAccountUseCase(repo, presenter);
    it('Test not found account', () => {
        use_case.execute("Dvvd");
        expect(presenter.fail).toHaveBeenCalled()
    });
});