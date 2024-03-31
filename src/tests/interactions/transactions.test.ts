import { AddTransactionUseCase, IAddTransactionUseCaseResponse } from '../../core/interactions/transaction/addTransactionUseCase';
import { CryptoService } from '../../core/adapter/libs';
import { TransactionRepository } from '../../core/interactions/repositories/transactionRepository';
import { RecordRepository } from '../../core/interactions/repositories/recordRepository';
import { CategoryRepository } from '../../core/interactions/repositories/categoryRepository';
import { TagRepository } from '../../core/interactions/repositories/tagRepository';
import { ValidationError } from '../../core/errors/validationError';
import { NotFoundError } from '../../core/errors/notFoundError';
import { Transaction } from '../../core/entities/transaction';
import { GetTransactionUseCase, IGetTransactionUseCase, IGetTransactionUseCaseResponse } from '../../core/interactions/transaction/getTransactionUseCase';
import { GetPaginationTransaction, IGetPaginationTransactionResponse } from '../../core/interactions/transaction/getPaginationTransactionUseCase';
import { DeleteTransactionUseCase, IDeleteTransactoinUseCaseResponse } from '../../core/interactions/transaction/deleteTransactionUseCase';
import { UpdateTransactionUseCase, IUpdateTransactionUseCaseResponse } from '../../core/interactions/transaction/updateTransactionUseCase';
import { AccountRepository } from '@/core/interactions/repositories/accountRepository';
import { IDeleteAccountUseCaseResponse } from '@/core/interactions/account/deleteAccountUseCase';

class MockCrypto implements CryptoService {
    generate_uuid_to_string(): string {
        return 'new id';
    }
}

describe('Creation transaction Use Case', () => {
    let trans_repo: TransactionRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn(),
        get_transactions_by_categories: jest.fn(),
        get_transactions_by_tags: jest.fn(),
        get_paginations:jest.fn(),
        get_account_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let account_repo: AccountRepository = {
        delete: jest.fn(),
        exist: jest.fn(),
        get:jest.fn().mockReturnValue(Promise.resolve(null) ),
        get_all: jest.fn(),
        save: jest.fn(),
        update: jest.fn()
    };
    let category_repo: CategoryRepository = {
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        save: jest.fn()
    };
    let record_repo: RecordRepository = {
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        get_many_by_id: jest.fn()
    };
    let tag_repo: TagRepository = {
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        save: jest.fn()
    };
    
    let crypto = new MockCrypto();

    let presenter: IAddTransactionUseCaseResponse = {
        success: jest.fn().mockReturnValue('new id'),
        fail: jest.fn().mockReturnValue(new ValidationError('validation'))
    }
    let use_case = new AddTransactionUseCase(trans_repo, record_repo, category_repo, tag_repo, account_repo, crypto, presenter);
    
    it('Test error description empty', () => {
        use_case.execute({
            description: ' ',
            date: new Date("vot, tot"),
            category_ref: ' d',
            account_ref: 'df',
            tag_ref: ['df'],
            price: 0,
            type: 'Credit'
        });
        expect(presenter.fail).toHaveBeenCalled()
        /*try { 
            use_case.execute({
                description: ' ',
                date: new Date("vot, tot"),
                category_ref: ' d',
                account_ref: 'df',
                tag_ref: ['df'],
                price: 0,
                type: TransactionType.Credit
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Description ref field is emtpy'));
        }*/
    });

    it('Test error category empty', () => {
        use_case.execute({
            description: 'df',
            date: new Date("vot, tot"),
            category_ref: '  ',
            account_ref: 'df',
            tag_ref: ['df'],
            price: 0,
            type: 'Credit'
        });
        expect(presenter.fail).toHaveBeenCalled()
        /*try {
            use_case.execute({
                description: 'df',
                date: new Date("vot, tot"),
                category_ref: '  ',
                account_ref: 'df',
                tag_ref: ['df'],
                price: 0,
                type: TransactionType.Credit
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Category ref field is empty'));
        }*/
    });

    it('Test error category empty', () => {
        use_case.execute({
            description: 'df',
            date: new Date("vot, tot"),
            category_ref: 'dsfd',
            account_ref: 'df',
            tag_ref: [' '],
            price: 0,
            type: "Credit"
        });
        expect(presenter.fail).toHaveBeenCalled()
        /*try {
            use_case.execute({
                description: 'df',
                date: new Date("vot, tot"),
                category_ref: 'dsfd',
                account_ref: 'df',
                tag_ref: [' '],
                price: 0,
                type: "Credit"
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Tag ref field is empty'));
        }*/
    });

    it('Test error price', () => {
        use_case.execute({
            description: 'df',
            date: new Date("vot, tot"),
            category_ref: 'Price must be greather or equal to 0',
            account_ref: 'df',
            tag_ref: ['df'],
            price: -12,
            type: "Credit"
        });
        expect(presenter.fail).toHaveBeenCalled()
        /*try {
            use_case.execute({
                description: 'df',
                date: new Date("vot, tot"),
                category_ref: 'Price must be greather or equal to 0',
                account_ref: 'df',
                tag_ref: ['df'],
                price: -12,
                type: "Credit"
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Price must be greather to 0'));
        }*/
    });

    it('Test error account ref', () => {
        use_case.execute({
            description: 'df',
            date: new Date("vot, tot"),
            category_ref: 'Price must be greather or equal to 0',
            account_ref: ' ',
            tag_ref: ['df'],
            price: -12,
            type: "Credit"
        });
        expect(presenter.fail).toHaveBeenCalled()
        /*try {
            use_case.execute({
                description: 'df',
                date: new Date("vot, tot"),
                category_ref: 'Price must be greather or equal to 0',
                account_ref: ' ',
                tag_ref: ['df'],
                price: -12,
                type: "Credit"
            });
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Account ref field is empty'));
        }*/
    });
});

describe('Get transaction Use Case', () => {
    let trans_repo: TransactionRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn(),
        get_transactions_by_categories: jest.fn(),
        get_transactions_by_tags: jest.fn(),
        get_paginations:jest.fn().mockReturnValue(["DF", "DF"]),
        get_account_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let account_repo: AccountRepository = {
        delete: jest.fn(),
        exist: jest.fn(),
        get:jest.fn().mockReturnValue(Promise.resolve(null) ),
        get_all: jest.fn(),
        save: jest.fn(),
        update: jest.fn()
    };
    let category_repo: CategoryRepository = {
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        save: jest.fn()
    };
    let record_repo: RecordRepository = {
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        get_many_by_id: jest.fn()
    };
    let tag_repo: TagRepository = {
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        save: jest.fn()
    };

    let presenter: IGetTransactionUseCaseResponse = {
        success: jest.fn().mockReturnValue('new id'),
        fail: jest.fn().mockReturnValue(new ValidationError('validation'))
    }
    let use_case = new GetTransactionUseCase(trans_repo, presenter);
    it('Test not found transaction', () => {
        use_case.execute('8');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('8');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Transaction not found'));
        }*/
    });

    let presenter2: IGetPaginationTransactionResponse = {
        success: jest.fn().mockReturnValue('new id'),
        fail: jest.fn().mockReturnValue(new ValidationError('validation'))
    }
    let use_case2 = new GetPaginationTransaction(trans_repo, account_repo, category_repo, tag_repo, record_repo, presenter2);
    it('Test page error transaction', () => {
        use_case2.execute({
            page: 0,
            size: 80,
            sort_by: null,
            sort_sense: null,
            account_filter: [],
            tag_filter: [],
            category_filter: []
        });
        expect(presenter2.fail).toHaveBeenCalled()
        /*try {
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
        }*/
    });

    it('Test error ascending null transaction', () => {
        use_case2.execute({
            page: 1,
            size: 80,
            sort_by: ' ',
            sort_sense: null,
            account_filter: [],
            tag_filter: [],
            category_filter: []
        });
        expect(presenter2.fail).toHaveBeenCalled()
        /*try {
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
        }*/
    });

    it('Test error ascending null transaction', () => {
        let _ = use_case2.execute({
            page: 1,
            size: 80,
            sort_by: 'date',
            sort_sense: null,
            account_filter: [],
            tag_filter: [],
            category_filter: []
        });
        expect(presenter2.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    it('Test error ascending transaction', () => {
        let _ = use_case2.execute({
            page: 1,
            size: 80,
            sort_by: 'date',
            sort_sense: ' ',
            account_filter: [],
            tag_filter: [],
            category_filter: []
        });
        expect(presenter2.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    it('Test size error transaction', () => {
        let _ = use_case2.execute({
            page: 1,
            size: 0,
            sort_by: null,
            sort_sense: null,
            account_filter: [],
            tag_filter: [],
            category_filter: []
        });
        expect(presenter2.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    it('Test pagination', () => {
        use_case2.execute({
            page: 1,
            size: 12,
            sort_by: null,
            sort_sense: null,
            account_filter: [],
            tag_filter: [],
            category_filter: []
        });
        expect(presenter2.success).toHaveBeenCalled();
        /*let response = use_case2.execute({
            page: 1,
            size: 12,
            sort_by: null,
            sort_sense: null,
            account_filter: [],
            tag_filter: [],
            category_filter: []
        });

        expect(response.transactions.length).toBe(1)*/
    });
});

describe('Update transaction use case', () => {
    let trans_repo: TransactionRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn(),
        get_transactions_by_categories: jest.fn(),
        get_transactions_by_tags: jest.fn(),
        get_paginations:jest.fn(),
        get_account_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let account_repo: AccountRepository = {
        delete: jest.fn(),
        exist: jest.fn(),
        get:jest.fn().mockReturnValue(Promise.resolve(null) ),
        get_all: jest.fn(),
        save: jest.fn(),
        update: jest.fn()
    };
    let category_repo: CategoryRepository = {
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        save: jest.fn()
    };
    let record_repo: RecordRepository = {
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        get_many_by_id: jest.fn()
    };
    let tag_repo: TagRepository = {
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        save: jest.fn()
    };

    let presenter: IUpdateTransactionUseCaseResponse = {
        success: jest.fn().mockReturnValue('new id'),
        fail: jest.fn().mockReturnValue(new ValidationError('validation'))
    }
    let use_case = new UpdateTransactionUseCase(trans_repo, presenter, account_repo, category_repo, tag_repo, record_repo);
    it('test no found transaction', () => {
        use_case.execute({
            id: 'df',
            tag_ref: null,
            category_ref: null,
            date: null,
            description: null,
            price: null,
            type: null
        });
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });
    
    let presenter2: IUpdateTransactionUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case2 = new UpdateTransactionUseCase(trans_repo, presenter2, account_repo, category_repo, tag_repo, record_repo);
    it('Test description', () => {
        use_case2.execute({
            id: 'df',
            tag_ref: null,
            category_ref: null,
            date: null,
            description: ' ',
            price: null,
            type: null
        });
        expect(presenter2.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    it('test price error', () => {
        use_case2.execute({
            id: 'df',
            tag_ref: null,
            category_ref: null,
            date: null,
            description: null,
            price: -56,
            type: null
        });
        expect(presenter2.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    it('category ref error', () => {
        use_case2.execute({
            id: 'df',
            tag_ref: null,
            category_ref: ' ',
            date: null,
            description: null,
            price: null,
            type: null
        });
        expect(presenter2.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    it('tag ref error', () => {
        use_case2.execute({
            id: 'df',
            tag_ref: ' ',
            category_ref: null,
            date: null,
            description: null,
            price: null,
            type: null
        });
        expect(presenter2.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });
});

describe('Delete Transaction Use case', () => {
    let repo: TransactionRepository = {
        save: jest.fn(),
        get_transactions_by_categories: jest.fn(),
        get_transactions_by_tags: jest.fn(),
        get: jest.fn().mockReturnValue(null),
        get_paginations: jest.fn(),
        get_account_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let presenter: IDeleteTransactoinUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    };

    let use_case = new DeleteTransactionUseCase(repo, presenter);
    it('Test not found transcation', () => {
        use_case.execute('9');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('9');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Transaction not found'));
        }*/
    });
});