import { InMemoryCategoryRepository } from "../../../infrastructure/inMemory/inMemoryCategoryRepository";
import { dbCategory } from "../../../interactions/repositories/categoryRepository";

describe('Tag Repository ', () => {
    let category_repository = new InMemoryCategoryRepository();
    it('Cretion category', () => {
        let response = category_repository.save({
            title: 'Cash',
            icon: 'blabla'
        });

        expect(response).toBe('Cash');
    });

    it('get category', () => {
        let response = category_repository.get('Cash');
        category_repository.save({
            title: 'food',
            icon: 'blabla'
        });
        let true_response: dbCategory = {
            title: 'Cash',
            icon: 'blabla'
        }
        
        expect(response).toStrictEqual(true_response);
    });

    it('get all categories', () => {
        let response = category_repository.get_all();

        expect(response.length).toBe(2);
    });

    it('delete category', () => {
        let response = category_repository.delete('Cash');
        
        expect(response).toBe(true);
        expect(category_repository.get_all().length).toBe(1);
    });
});