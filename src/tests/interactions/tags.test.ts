import { NotFoundError } from "../../core/errors/notFoundError";
import { ValidationError } from "../../core/errors/validationError";
import { TagRepository, dbTag } from "../../core/interactions/repositories/tagRepository";
import { CreationTagUseCase, ICreationTagUseCaseResponse } from "../../core/interactions/tag/creationTagUseCase";
import { DeleteTagUseCase } from "../../core/interactions/tag/deleteTagUseCase";
import { GetAllTagUseCase, IGetAllTagUseCaseResponse } from "../../core/interactions/tag/getAllTagsUseCase";
import { GetTagUseCase, IGetTagUseCase, IGetTagUseCaseResponse } from "../../core/interactions/tag/getTagUseCase";

describe('Add tag', () => {
    let repo: TagRepository = {
        save: jest.fn(),
        get:jest.fn(),
        save_multiple: jest.fn(),
        get_all:jest.fn(),
        delete: jest.fn(),
    };

    let presenter: ICreationTagUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case = new CreationTagUseCase(repo, presenter);

    test('test error title', () => {
        use_case.execute('  ');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {

            use_case.execute('  ');
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Title field empty'));
        }*/
    });
});

describe('Get tag', () => {
    let repo: TagRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn().mockReturnValue(null),
        save_multiple: jest.fn(),
        get_all:jest.fn().mockReturnValue(["1"]),
        delete: jest.fn(),
    };

    let presenter: IGetTagUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }


    let use_case = new GetTagUseCase(repo, presenter);
    test('Not found category', () => {
        use_case.execute('dfg');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('dfg');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Tag no found'));
        }*/
    });

    let presenter2: IGetAllTagUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case2 = new GetAllTagUseCase(repo, presenter2);
    test('all tags', () => {
        use_case2.execute();
        expect(presenter2.success).toHaveBeenCalled();
        /*let response = use_case2.execute();

        expect(response.length).toBe(1);*/
    });
});

describe('Delete tag', () => {
    let repo: TagRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn().mockReturnValue(null),
        save_multiple: jest.fn(),
        get_all:jest.fn(),
        delete: jest.fn(),
    };

    let presenter: ICreationTagUseCaseResponse = {
        success: jest.fn(),
        fail: jest.fn()
    }

    let use_case = new DeleteTagUseCase(repo, presenter);

    test('Test no found', () => {
        use_case.execute('df');
        expect(presenter.fail).toHaveBeenCalled();
        /*try {
            use_case.execute('df');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Tag not found'));
        }*/
    });
});