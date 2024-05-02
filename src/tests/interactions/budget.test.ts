import { Period } from "../../core/entities/budget";
import { CreationBudgetCategoryUseCase, CreationBudgetTagUseCase, ICreationBudgetUseCaseResponse } from "../../core/interactions/budgets/creationBudgetUseCase";
import { DeleteBudgetCategoryUseCase, DeleteBudgetTagUseCase, IDeleteBudgetUseCaseResponse } from "../../core/interactions/budgets/deleteBudgetUseCase";
import { GetAllBudgetCategoryUseCase, GetAllBudgetTagUseCase, IGetAllBudgetUseCaseResponse } from "../../core/interactions/budgets/getAllBudgetUseCase";
import { GetBudgetTagUseCase, GetBudgetCategoryUseCase, IGetBudgetUseCaseResponse, IGetBudgetUseCase } from "../../core/interactions/budgets/getBudgetUseCase";
import { IUpdateBudgetUseCaseResponse, UpdateBudgetCategoryUseCase, UpdateBudgetTagUseCase } from "../../core/interactions/budgets/updateBudgetUseCase";
import { NotFoundError } from "../../core/errors/notFoundError";
import { ValidationError } from "../../core/errors/validationError";
import { BudgetCategoryRepository, BudgetTagRepository} from "../../core/interactions/repositories/budgetRepository";
import { CryptoService } from "../../core/adapter/libs";
import { TagRepository } from "@/core/interactions/repositories/tagRepository";
import { TransactionRepository } from "@/core/interactions/repositories/transactionRepository";
import { CategoryRepository } from "@/core/interactions/repositories/categoryRepository";
import DateParser from "../../core/entities/date_parser";

class MockCrypto implements CryptoService {
    generate_uuid_to_string(): string {
        return 'new id';
    }
}


describe('Creation Budget Test', () => {
    
    let budget_cat_repo: BudgetCategoryRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        update: jest.fn()
    };

    let budget_tag_repo: BudgetTagRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn(),
        update: jest.fn()
    };

    let tag_repo: TagRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn()
    }

    let cat_repo: CategoryRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn().mockReturnValue(Promise.resolve(null)),
        get_all: jest.fn(),
    }


    let presenter_cat: ICreationBudgetUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    };

    let presenter_tag: ICreationBudgetUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    };

    let use_case = new CreationBudgetTagUseCase(budget_tag_repo, tag_repo, presenter_tag, new MockCrypto())
    test('Error title', async () => {
        await use_case.execute({
            title: '  ',
            target: 1533,
            date_start: new DateParser(2022, 2, 1),
            date_end: new DateParser(2022, 2, 2),
            tags: ['df']
        });
        expect(presenter_tag.fail).toHaveBeenCalled();
        /*try {
            use_case.execute({
                title: '  ',
                target: 1533,
                date_start: new Date('01-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: ['df']
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Title field is empty'));
        }*/
    });

    test('Error target', async () => {
        await use_case.execute({
            title: 'dffg',
            target: -45,
            date_start: new DateParser(2022, 2, 1),
            date_end: new DateParser(2022, 2, 2),
            tags: ['df']
        });
        expect(presenter_tag.fail).toHaveBeenCalled();
        /*try {
            use_case.execute({
                title: 'dffg',
                target: -45,
                date_start: new Date('01-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: ['df']
            });
            expect(presenter_tag.fail).toHaveBeenCalled();

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Target price must be greather than 0'));
        }*/
    });

    test('Error tags', async () => {
        await use_case.execute({
            title: 'df',
            target: 1533,
            date_start: new DateParser(2022, 2, 1),
            date_end: new DateParser(2022, 2, 2),
            tags: []
        });
        expect(presenter_tag.fail).toHaveBeenCalled();
        /*try {
            use_case.execute({
                title: 'df',
                target: 1533,
                date_start: new Date('01-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: []
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Tags must have at least 1 value'));
        }*/
    });

    let use_case2 = new CreationBudgetCategoryUseCase(budget_cat_repo, cat_repo, presenter_cat, new MockCrypto());
    test('Error categories', async () => {
        await use_case2.execute({
            title: 'dfs',
            target: 1533,
            period: 'Month',
            period_time: 21,
            categories: []
        });
        expect(presenter_cat.fail).toHaveBeenCalled();
        /*try {
            use_case2.execute({
                title: 'dfs',
                target: 1533,
                period: 'Month',
                period_time: 21,
                categories: []
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Budget categories must have at least 1 value'));
        }*/
    });

    test('Error period time', async () => {
        await use_case2.execute({
            title: 'dfd',
            target: 1533,
            period: "Month",
            period_time: -45,
            categories: ['dr']
        });
        expect(presenter_cat.fail).toHaveBeenCalled();
        /*try {
            use_case2.execute({
                title: 'dfd',
                target: 1533,
                period: Period.Month,
                period_time: -45,
                categories: ['dr']
            });

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Period time must be greather than 0'));
        }*/
    });


    test('Error date', async () => {
        await use_case.execute({
            title: 'dfd',
            target: 1533,
            date_start: new DateParser(2022, 4, 2),
            date_end: new DateParser(2022, 3, 2),
            tags: ['lgd']
        });
        expect(presenter_tag.fail).toHaveBeenCalled();
        /*try {
            use_case.execute({
                title: 'dfd',
                target: 1533,
                date_start: new Date('04-02-2022'),
                date_end: new Date('03-02-2022'),
                tags: ['lgd']
            });
            expect(presenter_cat.fail).toHaveBeenCalled();

        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Date start must be inferiour at Date of end'));
        }*/
    });
});

describe('Get budget test tag', () => {
    let repo: BudgetTagRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn().mockReturnValue([]),
        update: jest.fn()
    };

    let trans_repo: TransactionRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get_balance: jest.fn().mockReturnValue(0),
        get:jest.fn(),
        get_transactions_by_categories: jest.fn().mockReturnValue(["FD", "SDf"]),
        get_transactions_by_tags: jest.fn().mockReturnValue(["FD", "SDf"]),
        get_paginations:jest.fn(),
        get_account_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let presenter: IGetBudgetUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case = new GetBudgetTagUseCase(repo, trans_repo, presenter);

    test('error no found', async () => {
        await use_case.execute('ff');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('ff');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Budget not found'));
        }*/
    });

    let presenter_2: IGetAllBudgetUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case2 = new GetAllBudgetTagUseCase(repo, trans_repo, presenter_2);
    test('get All budget', async () => {
        await use_case2.execute();
        
        expect(presenter_2.success).toHaveBeenCalled();
    });
});

describe('Get budget test category', () => {
    let budget_repo: BudgetCategoryRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn().mockReturnValue([]),
        update: jest.fn()
    }

    let trans_repo: TransactionRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get_balance: jest.fn().mockReturnValue(0),
        get:jest.fn(),
        get_transactions_by_categories: jest.fn(),
        get_transactions_by_tags: jest.fn(),
        get_paginations:jest.fn(),
        get_account_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let presenter: IGetBudgetUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case = new GetBudgetCategoryUseCase(budget_repo, trans_repo, presenter);

    test('error no found', async () => {
        await use_case.execute('ff');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('ff');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Budget not found'));
        }*/
    });

    let presenter_2: IGetAllBudgetUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case2 = new GetAllBudgetCategoryUseCase(budget_repo, trans_repo, presenter_2);
    test('get All budget', async () => {
        await use_case2.execute();
        expect(presenter_2.success).toHaveBeenCalled();
    });
});

describe('Delete budget test cat', ( ) => {
    let repo_cat: BudgetCategoryRepository = {
        save: jest.fn(),
        delete: jest.fn().mockReturnValue(""),
        get: jest.fn().mockReturnValue(Promise.resolve(null)),
        get_all: jest.fn(),
        update: jest.fn()
    }

    let repo_tag: BudgetTagRepository = {
        save: jest.fn(),
        delete: jest.fn().mockReturnValue("F"),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn(),
        update: jest.fn()
    }

    let presenter: IDeleteBudgetUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case = new DeleteBudgetCategoryUseCase(repo_cat, presenter);

    test('test delete budget category', async () => {
        await use_case.execute('ff');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('ff');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Budget not found'));
        }*/
    });


    let presenter2: IDeleteBudgetUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case2 = new DeleteBudgetTagUseCase(repo_tag, presenter2);

    test('test delete tag', async () => {
        await use_case2.execute('ff');
        expect(presenter2.fail).toHaveBeenCalled();
        /*try {
            use_case2.execute('ff');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Budget not found'));
        }*/
    });
});

describe('Update Budget test', () => {
    let budget_tag_repo: BudgetTagRepository = {
        save: jest.fn(),
        delete: jest.fn().mockReturnValue(false),
        get: jest.fn().mockReturnValue(null),
        get_all: jest.fn(),
        update: jest.fn()
    };

    let budget_cat_repo: BudgetCategoryRepository = {
        save: jest.fn(),
        delete: jest.fn().mockReturnValue(false),
        get: jest.fn().mockReturnValue(Promise.resolve(null)),
        get_all: jest.fn(),
        update: jest.fn()
    };

    let trans_repo: TransactionRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get_balance: jest.fn().mockReturnValue(0),
        get:jest.fn(),
        get_transactions_by_categories: jest.fn(),
        get_transactions_by_tags: jest.fn(),
        get_paginations:jest.fn(),
        get_account_balance: jest.fn().mockReturnValue(0),
        delete: jest.fn(),
        update: jest.fn()
    };

    let tag_repo: TagRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        get_all: jest.fn()
    }

    let cat_repo: CategoryRepository = {
        save: jest.fn(),
        delete: jest.fn(),
        get: jest.fn().mockReturnValue(Promise.resolve(null)),
        get_all: jest.fn().mockReturnValue(Promise.resolve([])),
    }
  
    let presenter: IUpdateBudgetUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case = new UpdateBudgetTagUseCase(budget_tag_repo, trans_repo, presenter, tag_repo);

    test('Error no found budget', async () => {
        await use_case.execute({
            id: 'df',
            title: 'dfd',
            target: 1533,
            date_start: new DateParser(2022, 2, 1),
            date_end: new DateParser(2022, 2, 2),
            tags: ['lgd']
        });
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    let use_case2 = new UpdateBudgetTagUseCase(budget_tag_repo, trans_repo, presenter, tag_repo);
    test('Verify Update title', async () => {
        await use_case2.execute({
            id: 'df',
            title: '   ',
            target: null,
            date_start: null,
            date_end: null,
            tags: null
        });
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    test('Verify update target', async () => {
        await use_case2.execute({
            id: 'df',
            title: null,
            target: -45,
            date_start: null,
            date_end: null,
            tags: null
        });
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    test('Verify update date', async () => {
        await use_case2.execute({
            id: 'df',
            title: null,
            target: null,
            date_start: new DateParser(2022, 2, 1),
            date_end: new DateParser(2022, 2, 2),
            tags: null
        });
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    test('Verify update tags', async () => {
        await use_case2.execute({
            id: 'df',
            title: null,
            target: null,
            date_start: null,
            date_end: null,
            tags: []
        });
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });

    let use_case3 = new UpdateBudgetCategoryUseCase(budget_cat_repo, trans_repo, cat_repo, presenter);
    test('Verify update categories', async () => {
        await use_case3.execute({
            id: 'df',
            title: null,
            target: null,
            period: null,
            period_time: null,
            categories: []
        });
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });
    
    test('Verify update period time', async () => {
        await use_case3.execute({
            id: 'df',
            title: null,
            target: null,
            period: null,
            period_time: -45,
            categories: null
        });
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
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
        }*/
    });
});