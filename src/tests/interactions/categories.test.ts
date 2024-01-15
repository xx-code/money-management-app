import { CreationCategoryUseCase } from "../../interactions/category/creationCategoryUseCase";
import { DeleteCategoryUseCase } from "../../interactions/category/deleteCategoryUseCase";
import { GetAllCategoryUseCase } from "../../interactions/category/getAllCategoryUseCase";
import { GetCategoryUseCase } from "../../interactions/category/getCategoryUseCase";
import { NotFoundError } from "../../interactions/errors/notFoundError";
import { ValidationError } from "../../interactions/errors/validationError";
import { CategoryRepository, dbCategory } from "../../interactions/repositories/categoryRepository";

describe('Add category', () => {
    let repo: CategoryRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn(),
        get_all:jest.fn(),
        delete: jest.fn(),
    };

    let use_case = new CreationCategoryUseCase(repo);

    test('test error title', () => {
        try {
            let request =  {
                title: '  ',
                icon: 'icon'
            };

            use_case.execute(request);
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Title field empty'));
        }
    });
    
    test('test error icon', () => {
        
        try {
            let request =  {
                title: 'title',
                icon: ' '
            };

            use_case.execute(request);
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Icon field empty'));
        }
    });
});

describe('Get Category', () => {
    let val: dbCategory = {title: 'df', icon: 'df'};
    let repo: CategoryRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn().mockReturnValue(null),
        get_all:jest.fn().mockReturnValue([val]),
        delete: jest.fn(),
    };

    let use_case = new GetCategoryUseCase(repo);
    test('Not found category', () => {
        try {
            use_case.execute('dfg');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Category no found'));
        }
    });

    let use_case2 = new GetAllCategoryUseCase(repo);
    test('all categories', () => {
        let response = use_case2.execute();

        expect(response.length).toBe(1);
    });
});

describe('Delete Category', () => {
    let repo: CategoryRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn().mockReturnValue(null),
        get_all:jest.fn(),
        delete: jest.fn(),
    };

    let use_case = new DeleteCategoryUseCase(repo);

    test('Test no found', () => {
        try {
            use_case.execute('df');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Category not found'));
        }
    });
});