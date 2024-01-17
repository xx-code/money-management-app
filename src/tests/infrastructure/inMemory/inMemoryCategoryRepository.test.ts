import { InMemoryCategoryRepository } from "../../../infrastructure/inMemory/inMemoryCategoryRepository";
import { dbCategory } from "../../../interactions/repositories/categoryRepository";

describe('Tag Repository ', () => {
    let category_repository = new InMemoryCategoryRepository();
    it('Cretion tag', () => {
        let response = category_repository.save({
            title: 'Cash',
            icon: 'blabla'
        });

        expect(response).toBe('Cash');
    });

    it('get tag', () => {
        let response = category_repository.get('Cash');
        let true_response: dbCategory = {
            title: 'Cash',
            icon: 'blabla'
        }
        expect(response).toStrictEqual(true_response);
    });

    it('get all tags', () => {
        let response = category_repository.get_all();

        expect(response.length).toBe(1);
    });

    it('delete tag', () => {
        let response = category_repository.delete('Cash');
        
        expect(response).toBe(true);
        expect(category_repository.get_all().length).toBe(0);
    });
});