import { NotFoundError } from "../../interactions/errors/notFoundError";
import { ValidationError } from "../../interactions/errors/validationError";
import { TagRepository, dbTag } from "../../interactions/repositories/tagRepository";
import { CreationTagUseCase } from "../../interactions/tag/creationTagUseCase";
import { DeleteTagUseCase } from "../../interactions/tag/deleteTagUseCase";
import { GetAllTagUseCase } from "../../interactions/tag/getAllTagsUseCase";
import { GetTagUseCase } from "../../interactions/tag/getTagUseCase";

describe('Add tag', () => {
    let repo: TagRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn(),
        get_all:jest.fn(),
        delete: jest.fn(),
    };

    let use_case = new CreationTagUseCase(repo);

    test('test error title', () => {
        try {

            use_case.execute('  ');
        } catch(err) {
            expect(err).toStrictEqual(new ValidationError('Title field empty'));
        }
    });
});

describe('Get tag', () => {
    let val: dbTag = {title: 'df'};
    let repo: TagRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn().mockReturnValue(null),
        get_all:jest.fn().mockReturnValue([val]),
        delete: jest.fn(),
    };

    let use_case = new GetTagUseCase(repo);
    test('Not found category', () => {
        try {
            use_case.execute('dfg');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Tag no found'));
        }
    });

    let use_case2 = new GetAllTagUseCase(repo);
    test('all tags', () => {
        let response = use_case2.execute();

        expect(response.length).toBe(1);
    });
});

describe('Delete tag', () => {
    let repo: TagRepository = {
        save: jest.fn().mockReturnValue('new id'),
        get:jest.fn().mockReturnValue(null),
        get_all:jest.fn(),
        delete: jest.fn(),
    };

    let use_case = new DeleteTagUseCase(repo);

    test('Test no found', () => {
        try {
            use_case.execute('df');
        } catch(err) {
            expect(err).toStrictEqual(new NotFoundError('Tag not found'));
        }
    });
});