import { Period } from "../../entities/budget";
import { CreationBudgetCategoryUseCase, CreationBudgetTagUseCase } from "../../interactions/budgets/creationBudgetUseCase";
import { DeleteBudgetCategoryUseCase, DeleteBudgetTagUseCase } from "../../interactions/budgets/deleteBudgetUseCase";
import { GetAllBudgetCategoryUseCase, GetAllBudgetTagUseCase } from "../../interactions/budgets/getAllBudgetUseCase";
import { GetBudgetTagUseCase, GetBudgetCategoryUseCase } from "../../interactions/budgets/getBudgetUseCase";
import { UpdateBudgetCategoryUseCase, UpdateBudgetTagUseCase } from "../../interactions/budgets/updateBudgetUseCase";
import { NotFoundError } from "../../interactions/errors/notFoundError";
import { ValidationError } from "../../interactions/errors/validationError";
import { BudgetCategoryRepository, BudgetTagRepository, dbBudgetCategoryResponse, dbBudgetTagResponse } from "../../interactions/repositories/budgetRepository";
import { Crypto } from "../../interactions/utils/cryto";

class MockCrypto implements Crypto {
    generate_uuid_to_string(): string {
        return 'new id';
    }
}


describe('Creation Budget Test', () => {
    
    let repo_cat: BudgetCategoryRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        update: jest.fn()
    }

    let repo_tag: BudgetTagRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        update: jest.fn()
    }

    let use_case = new CreationBudgetTagUseCase(repo_tag, new MockCrypto())
    test('Error title', () => {
        try {
            use_case.execute({
                title: '  ',
                target: 1533,
                date_start: new Date('01-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: ['df']
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Title field is empty'));
        }
    });

    test('Error target', () => {
        try {
            use_case.execute({
                title: 'dffg',
                target: -45,
                date_start: new Date('01-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: ['df']
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Target price must be greather than 0'));
        }
    });

    test('Error tags', () => {
        try {
            use_case.execute({
                title: 'df',
                target: 1533,
                date_start: new Date('01-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: []
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Tags must have at least 1 value'));
        }
    });

    let use_case2 = new CreationBudgetCategoryUseCase(repo_cat, new MockCrypto());
    test('Error categories', () => {
        try {
            use_case2.execute({
                title: 'dfs',
                target: 1533,
                period: Period.Month,
                period_time: 21,
                categories: []
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Budget categories must have at least 1 value'));
        }
    });

    test('Error period time', () => {
        try {
            use_case2.execute({
                title: 'dfd',
                target: 1533,
                period: Period.Month,
                period_time: -45,
                categories: ['dr']
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Period time must be greather than 0'));
        }
    });


    test('Error date', () => {
        try {
            use_case.execute({
                title: 'dfd',
                target: 1533,
                date_start: new Date('04-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: ['lgd']
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Date start must be inferiour at Date of end'));
        }
    });
});

describe('Get budget test tag', () => {
    let true_val:dbBudgetTagResponse = {
        id: 'df',
        target: 1500,
        current: 2688,
        date_start: new Date('15-02-2004'),
        date_end: new Date('16-02-2004'),
        tags: ['df'],
        title: 'dfffg'
    }

    let repo: BudgetTagRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn().mockReturnValue([true_val]),
        update: jest.fn()
    }

    let use_case = new GetBudgetTagUseCase(repo);

    test('error no found', () => {
        try {
            use_case.execute('ff');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Budget not found'));
        }
    });

    let use_case2 = new GetAllBudgetTagUseCase(repo);
    test('get All budget', () => {
        let response = use_case2.execute();
        
        expect(response.length).toBe(1);
    });
});

describe('Get budget test category', () => {
    let true_val:dbBudgetCategoryResponse = {
        id: 'df',
        target: 1500,
        current: 2688,
        period: 'Month',
        period_time: 1,
        categories: ["df"],
        title: 'dfffg'
    }

    let repo: BudgetCategoryRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn().mockReturnValue([true_val]),
        update: jest.fn()
    }

    let use_case = new GetBudgetCategoryUseCase(repo);

    test('error no found', () => {
        try {
            use_case.execute('ff');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Budget not found'));
        }
    });

    let use_case2 = new GetAllBudgetCategoryUseCase(repo);
    test('get All budget', () => {
        let response = use_case2.execute();
        
        expect(response.length).toBe(1);
    });
});

describe('Delete budget test cat', ( ) => {
    let repo_cat: BudgetCategoryRepository = {
        save: jest.fn(),
        delete: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn(),
        update: jest.fn()
    }

    let repo_tag: BudgetTagRepository = {
        save: jest.fn(),
        delete: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn(),
        update: jest.fn()
    }

    let use_case = new DeleteBudgetCategoryUseCase(repo_cat);

    test('test delete category', () => {
        try {
            use_case.execute('ff');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Budget not found'));
        } 
    });

    let use_case2 = new DeleteBudgetTagUseCase(repo_tag);

    test('test delete tag', () => {
        try {
            use_case2.execute('ff');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Budget not found'));
        } 
    });
});

describe('Update Budget test', () => {
    let true_val:dbBudgetTagResponse = {
        id: 'df',
        target: 1500,
        current: 2688,
        date_start: new Date('15-02-2004'),
        date_end: new Date('16-02-2004'),
        tags: ['df'],
        title: 'dfffg'
    }

    let repo: BudgetTagRepository = {
        save: jest.fn(),
        delete: jest.fn().mockReturnValue(false),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn(),
        update: jest.fn()
    }

    let use_case = new UpdateBudgetTagUseCase(repo);

    test('Error no found budget', () => {
        try {
            use_case.execute({
                id: 'df',
                title: 'dfd',
                target: 1533,
                date_start: new Date('01-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: ['lgd']
            });
        } catch (err) {
            expect(err).toStrictEqual(new NotFoundError('Budget not found'))
        }
    });

    let repo_tag: BudgetTagRepository = {
        save: jest.fn(),
        delete: jest.fn().mockReturnValue(false),
        get: jest.fn().mockReturnValue(true_val),
        get_all: jest.fn(),
        update: jest.fn()
    }

    let repo_cat: BudgetCategoryRepository = {
        save: jest.fn(),
        delete: jest.fn().mockReturnValue(false),
        get: jest.fn().mockReturnValue(true_val),
        get_all: jest.fn(),
        update: jest.fn()
    }
    let use_case2 = new UpdateBudgetTagUseCase(repo_tag);
    test('Verify Update title', () => {
        try {
            use_case2.execute({
                id: 'df',
                title: '   ',
                target: null,
                date_start: null,
                date_end: null,
                tags: null
            });
        } catch (err) {
            expect(err).toStrictEqual(new ValidationError('Title field is empty'));
        }
    });

    test('Verify update target', () => {
        try {
            use_case2.execute({
                id: 'df',
                title: null,
                target: -45,
                date_start: null,
                date_end: null,
                tags: null
            });
        } catch (err) {
            expect(err).toStrictEqual(new ValidationError('Target price must be greather than 0'));
        }
    });

    test('Verify update date', () => {
        try {
            use_case2.execute({
                id: 'df',
                title: null,
                target: null,
                date_start: new Date('04-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: null
            });
        } catch (err) {
            expect(err).toStrictEqual(new ValidationError('Date start must be inferiour at Date of end'));
        }
    });

    test('Verify update tags', () => {
        try {
            use_case2.execute({
                id: 'df',
                title: null,
                target: null,
                date_start: null,
                date_end: null,
                tags: []
            });
        } catch (err) {
            expect(err).toStrictEqual(new ValidationError('Tags must have at least 1 value'));
        }
    });

    let use_case3 = new UpdateBudgetCategoryUseCase(repo_cat);
    test('Verify update categories', () => {
        try {
            use_case3.execute({
                id: 'df',
                title: null,
                target: null,
                period: null,
                period_time: null,
                categories: []
            });
        } catch (err) {
            expect(err).toStrictEqual(new ValidationError('Budget categories must have at least 1 value'));
        }
    });
    
    test('Verify update period time', () => {
        try {
            use_case3.execute({
                id: 'df',
                title: null,
                target: null,
                period: null,
                period_time: -45,
                categories: null
            });
        } catch (err) {
            expect(err).toStrictEqual(new ValidationError('Period time must be greather than 0'));
        }
    });
});