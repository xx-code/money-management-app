import { InMemoryTagRepository } from "../../../infrastructure/inMemory/inMemoryTagRepository";
import { dbTag } from "../../../interactions/repositories/tagRepository";

describe('Tag Repository ', () => {
    let tag_repository = new InMemoryTagRepository();
    it('Cretion tag', () => {
        let response = tag_repository.save({
            title: 'tag'
        });

        expect(response).toBe('tag');
    });

    it('get tag', () => {
        let response = tag_repository.get('tag');
        let true_response: dbTag = {
            title: 'tag'
        }
        expect(response).toStrictEqual(true_response);
    });

    it('get all tags', () => {
        let response = tag_repository.get_all();

        expect(response.length).toBe(1);
    });

    it('delete tag', () => {
        let response = tag_repository.delete('tag');
        
        expect(response).toBe(true);
        expect(tag_repository.get_all().length).toBe(0);
    });
});