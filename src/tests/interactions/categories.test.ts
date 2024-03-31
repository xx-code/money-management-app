import { CreationCategoryUseCase, ICreationCategoryUseCase, ICreationCategoryUseCaseResponse } from "../../core/interactions/category/creationCategoryUseCase";
import { DeleteCategoryUseCase, IDeleteCategoryUseCaseResponse } from "../../core/interactions/category/deleteCategoryUseCase";
import { GetAllCategoryUseCase, IGetAllCategoryUseCaseResponse } from "../../core/interactions/category/getAllCategoryUseCase";
import { GetCategoryUseCase, IGetCategoryUseCaseResponse } from "../../core/interactions/category/getCategoryUseCase";
import { NotFoundError } from "../../core/errors/notFoundError";
import { ValidationError } from "../../core/errors/validationError";
import { CategoryRepository, dbCategory } from "../../core/interactions/repositories/categoryRepository";

describe('Add category', () => {
    let repo: CategoryRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn().mockRejectedValue(Promise.resolve(null)),
        get_all:jest.fn(),
        delete: jest.fn(),
    };

    let presenter: ICreationCategoryUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case = new CreationCategoryUseCase(repo, presenter);

    test('test error title', () => {
        let request =  {
            title: '  ',
            icon: 'icon'
        };
        use_case.execute(request);
        expect(presenter.fail).toHaveBeenCalled()
        /*try {
            let request =  {
                title: '  ',
                icon: 'icon'
            };

            use_case.execute(request);
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Title field empty'));
        }*/
    });
    
    test('test error icon', () => {
        let request =  {
            title: 'title',
            icon: ' '
        };

        use_case.execute(request);
        expect(presenter.fail).toHaveBeenCalled()
        /*try {
            let request =  {
                title: 'title',
                icon: ' '
            };

            use_case.execute(request);
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Icon field empty'));
        }*/
    });
});

describe('Get Category', () => {
    let val: dbCategory = {title: 'df', icon: 'df'};
    let repo: CategoryRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn().mockReturnValue(Promise.resolve(null)),
        get_all:jest.fn().mockReturnValue(Promise.resolve(["", ""])),
        delete: jest.fn(),
    };

    let presenter: IGetCategoryUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case = new GetCategoryUseCase(repo, presenter);
    test('Not found category', async () => {
        await use_case.execute('dfg');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('dfg');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Category no found'));
        }*/
    });

    let presenter2: IGetAllCategoryUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case2 = new GetAllCategoryUseCase(repo, presenter2);
    test('all categories', async () => {
        await use_case2.execute();
        expect(presenter2.success).toHaveBeenCalled();

        //expect(response.length).toBe(1);
    });
});

describe('Delete Category', () => {
    let repo: CategoryRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn().mockReturnValue(Promise.resolve(null)),
        get_all:jest.fn(),
        delete: jest.fn().mockReturnValue(Promise.resolve(false)),
    };

    let presenter: IDeleteCategoryUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case = new DeleteCategoryUseCase(repo, presenter);

    test('Test no found', async () => {
        await use_case.execute('df');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('df');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Category not found'));
        }*/
    });
});