import { AddTransactionUseCase } from '../../interactions/transaction/addTransactionUseCase';
import { Crypto } from '../../interactions/utils/cryto';
import { TransactionRepository } from '../../interactions/repositories/transactionRepository';
import { ValidationError } from '../../interactions/errors/validationError';
import { NotFoundError } from '../../interactions/errors/notFoundError';
import { TransactionDisplay, TransactionType } from '../../entities/transaction';
import { GetTransactionUseCase } from '../../interactions/transaction/getTransactionUseCase';
import { GetPaginationTransaction } from '../../interactions/transaction/getPaginationTransactionUseCase';
import { DeleteTransactionUseCase } from '../../interactions/transaction/deleteTransactionUseCase';
import { UpdateTransactionUseCase } from '../../interactions/transaction/updateTransactionUseCase';

class MockCrypto implements Crypto {
    generate_uuid_to_string(): string {
        return 'new id';
    }
}

describe('Creation Account Use Case', () => {
    let repo: TransactionRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn(),
        get_paginations:jest.fn(),
        get_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };
    
    let crypto = new MockCrypto();

    let use_case = new AddTransactionUseCase(repo, crypto);
    
    it('Test error description empty', () => {
        try { 
            use_case.execute({
                description: ' ',
                date: new Date("vot, tot"),
                category_ref: ' d',
                account_ref: 'df',
                tag_ref: 'df',
                price: 0,
                type: TransactionType.Credit
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Description ref field is emtpy'));
        }
    });

    it('Test error category empty', () => {
        try {
            use_case.execute({
                description: 'df',
                date: new Date("vot, tot"),
                category_ref: '  ',
                account_ref: 'df',
                tag_ref: 'df',
                price: 0,
                type: TransactionType.Credit
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Category ref field is empty'));
        }
    });

    it('Test error category empty', () => {
        try {
            use_case.execute({
                description: 'df',
                date: new Date("vot, tot"),
                category_ref: 'dsfd',
                account_ref: 'df',
                tag_ref: ' ',
                price: 0,
                type: TransactionType.Credit
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Tag ref field is empty'));
        }
    });

    it('Test error price', () => {
        try {
            use_case.execute({
                description: 'df',
                date: new Date("vot, tot"),
                category_ref: 'Price must be greather or equal to 0',
                account_ref: 'df',
                tag_ref: 'df',
                price: -12,
                type: TransactionType.Credit
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Price must be greather to 0'));
        }
    });

    it('Test error account ref', () => {
        try {
            use_case.execute({
                description: 'df',
                date: new Date("vot, tot"),
                category_ref: 'Price must be greather or equal to 0',
                account_ref: ' ',
                tag_ref: 'df',
                price: -12,
                type: TransactionType.Credit
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Account ref field is empty'));
        }
    });
});

describe('Get Account Use Case', () => {
    let mock_rest: TransactionDisplay = {id: '1', description: 'trr', date: new Date('gd'), tag: 'df', category_icon: 'df', category_title: 'df', price: 45, account_ref: 'dff', type: 'Credit', };
    let repo: TransactionRepository = {
        save: jest.fn(),
        get:jest.fn().mockReturnValue(null),
        get_paginations:jest.fn().mockReturnValue({transactions: [mock_rest], current_page: 1, max_pages:2}),
        get_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };
    
    let use_case = new GetTransactionUseCase(repo);
    it('Test not found transaction', () => {
        try {
            use_case.execute('8');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Transaction not found'));
        }
    });

    let use_case2 = new GetPaginationTransaction(repo);
    it('Test page error transaction', () => {
        try {
            let _ = use_case2.execute({
                page: 0,
                size: 80,
                sort_by: null,
                sort_sense: null,
                account_filter: [],
                tag_filter: [],
                category_filter: []
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Page request must be greather than 0'));
        }
    });

    it('Test error ascending null transaction', () => {
        try {
            let _ = use_case2.execute({
                page: 1,
                size: 80,
                sort_by: ' ',
                sort_sense: null,
                account_filter: [],
                tag_filter: [],
                category_filter: []
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Sort by is empty field'));
        }
    });

    it('Test error ascending null transaction', () => {
        try {
            let _ = use_case2.execute({
                page: 1,
                size: 80,
                sort_by: 'date',
                sort_sense: null,
                account_filter: [],
                tag_filter: [],
                category_filter: []
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Sort sense field is empty'));
        }
    });

    it('Test error ascending transaction', () => {
        try {
            let _ = use_case2.execute({
                page: 1,
                size: 80,
                sort_by: 'date',
                sort_sense: ' ',
                account_filter: [],
                tag_filter: [],
                category_filter: []
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('The sort sense must be \'asc\' or \'desc\''));
        }
    });

    it('Test size error transaction', () => {
        try {
            let _ = use_case2.execute({
                page: 1,
                size: 0,
                sort_by: null,
                sort_sense: null,
                account_filter: [],
                tag_filter: [],
                category_filter: []
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Size must be greather than 0'));
        }
    });

    it('Test pagination', () => {
        let response = use_case2.execute({
            page: 1,
            size: 12,
            sort_by: null,
            sort_sense: null,
            account_filter: [],
            tag_filter: [],
            category_filter: []
        });

        expect(response.transactions.length).toBe(1)
    });
});

describe('Update use case', () => {
    let mock_rest: TransactionDisplay = {id: 'df', description: 'trr', date: new Date('gd'), tag: 'df', category_icon: 'df', category_title: 'df', price: 45, account_ref: 'dff', type: 'Credit', };
    let repo: TransactionRepository = {
        save: jest.fn(),
        get:jest.fn().mockReturnValue(null),
        get_paginations:jest.fn(),
        get_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let use_case = new UpdateTransactionUseCase(repo);
    it('test no found transaction', () => {
        try {
            use_case.execute({
                id: 'df',
                tag_ref: null,
                category_ref: null,
                date: null,
                description: null,
                price: null,
                type: null
            });
        } catch (error) {
            expect(error).toStrictEqual(new NotFoundError('Transaction not found'));
        }
    });
    
    let repo2: TransactionRepository = {
        save: jest.fn(),
        get:jest.fn().mockReturnValue(mock_rest),
        get_paginations:jest.fn().mockReturnValue({transactions: [mock_rest], current_page: 1, max_pages:2}),
        get_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let use_case2 = new UpdateTransactionUseCase(repo2);
    it('Test description', () => {
        try {
            use_case2.execute({
                id: 'df',
                tag_ref: null,
                category_ref: null,
                date: null,
                description: ' ',
                price: null,
                type: null
            });
        } catch (error) {
            expect(error).toStrictEqual(new ValidationError('Description ref field is emtpy'));
        }
    });

    it('test price error', () => {
        try {
            use_case2.execute({
                id: 'df',
                tag_ref: null,
                category_ref: null,
                date: null,
                description: null,
                price: -56,
                type: null
            });
        } catch (error) {
            expect(error).toStrictEqual(new ValidationError('Price must be greather to 0'));
        }
    });

    it('category ref error', () => {
        try {
            use_case2.execute({
                id: 'df',
                tag_ref: null,
                category_ref: ' ',
                date: null,
                description: null,
                price: null,
                type: null
            });
        } catch (error) {
            expect(error).toStrictEqual(new ValidationError('Category ref field is empty'));
        }
    });

    it('tag ref error', () => {
        try {
            use_case2.execute({
                id: 'df',
                tag_ref: ' ',
                category_ref: null,
                date: null,
                description: null,
                price: null,
                type: null
            });
        } catch (error) {
            expect(error).toStrictEqual(new ValidationError('Tag ref field is empty'));
        }
    });
});

describe('Delete Transaction Use case', () => {
    let repo: TransactionRepository = {
        save: jest.fn(),
        get: jest.fn().mockReturnValue(null),
        get_paginations: jest.fn(),
        get_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let use_case = new DeleteTransactionUseCase(repo);
    it('Test not found transcation', () => {
        try {
            use_case.execute('9');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Transaction not found'));
        }
    })
});